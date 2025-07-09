const EWS = require('node-ews')
const cheerio = require('cheerio')
const Excel = require('exceljs')

class EWSEmailManager {

  constructor(option) {
    this.option = option
    this.manager = new EWS(this.option)
  }

  async fetch_daily_report_data(email) {
    let Function = 'GetItem';
    let Args = {
      "ItemShape": {
        't:BaseShape': 'AllProperties'
      },
      "ItemIds": {
        "t:ItemId": email.ItemId
      }
    }
    let result = await this.manager.run(Function, Args)
    let message = result.ResponseMessages.GetItemResponseMessage.Items.Message
    const $ = cheerio.load(message.Body.$value), records = []
    let data = $.text().split(/\n/).map(item => item.trim())
    let findFlag = false, startFlag = -1
    for(let i = 0; i < data.length; i++) {
      if (data[i].indexOf("Miscellaneous") !== -1) {
        findFlag = true
      }
      else if (findFlag) {
        if (data[i].length > 0) {
          startFlag = i
          break
        }
      }
    }
    if (startFlag !== -1) {
      for(let i = startFlag; i < data.length; i++) {
        if (data[i].indexOf("Best Regards") !== -1) break
        else if (data[i].length > 0 && data[i] !== '-') {
          records.push(data[i])
        }
      }
    }
    return records
  }

  async fetch_daily_report_list (limit = 10) {
    let Function = 'FindItem';
    let Args = {
      'attributes': {
        'Traversal': 'Shallow'
      },
      'SortOrder': {
        't:FieldOrder': {
          'attributes': {
            'Order': 'Descending',
          },
          't:FieldURI': {
            'attributes': {
              'FieldURI': 'item:DateTimeReceived'
            }
          }
        }
      },
      'IndexedPageItemView': {
        'attributes': {
          'Offset': 0,
          'MaxEntriesReturned': limit,
          'BasePoint': 'Beginning'
        }
      },
      'ItemShape': {
        't:BaseShape': 'AllProperties'
      },
      'ParentFolderIds' : {
        't:FolderId': {
          'attributes': this.option.dailyReport
        }
      }
    };
    let result = await this.manager.run(Function, Args)
    let messages = result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.Message
    for(let i = 0; i < messages.length; i++) {
      let msg = messages[i]
      msg.ContextDate = new Date(msg.Subject.split("-")[1])
    }
    return messages
  }

  async extract_allocation_attachment (email) {
    if (!email.Attachments) {
      return null
    }
    if (!email.Attachments.FileAttachment) {
      return null
    }
    let attachments = email.Attachments.FileAttachment instanceof Array ? email.Attachments.FileAttachment : [email.Attachments.FileAttachment]
    let excel = attachments.find(item => item.ContentType.indexOf("excel") !== -1)
    if (!excel) {
      return null
    }
    let Function = 'GetAttachment'
    let Args = {
      'AttachmentIds': {
        't:AttachmentId': excel.AttachmentId
      }
    }
    let result = await this.manager.run(Function, Args)
    return Buffer.from(result.ResponseMessages.GetAttachmentResponseMessage.Attachments.FileAttachment.Content, "base64")
  }

  async fetch_allocation_report(email) {
    let Function = 'GetItem';
    let Args = {
      "ItemShape": {
        't:BaseShape': 'AllProperties'
      },
      "ItemIds": {
        "t:ItemId": email.ItemId
      }
    }
    let result = await this.manager.run(Function, Args)
    let message = result.ResponseMessages.GetItemResponseMessage.Items.Message
    let report = await this.extract_allocation_attachment(message)
    if (!report) {
      return null
    }
    let workbook = await new Excel.Workbook().xlsx.load(report)
    let summarySheet = workbook.getWorksheet("Summary")
    let date = summarySheet.getRow(4).getCell("K").value.result
    return {
      date,
      report
    }
  }

  async fetch_allocation_report_list (limit = 10) {
    let Function = 'FindItem';
    let Args = {
      'attributes': {
        'Traversal': 'Shallow'
      },
      'SortOrder': {
        't:FieldOrder': {
          'attributes': {
            'Order': 'Descending',
          },
          't:FieldURI': {
            'attributes': {
              'FieldURI': 'item:DateTimeReceived'
            }
          }
        }
      },
      'IndexedPageItemView': {
        'attributes': {
          'Offset': 0,
          'MaxEntriesReturned': limit,
          'BasePoint': 'Beginning'
        }
      },
      'ItemShape': {
        't:BaseShape': 'AllProperties'
      },
      'ParentFolderIds' : {
        't:FolderId': {
          'attributes': this.option.allocationReport
        }
      }
    };
    let result = await this.manager.run(Function, Args)
    return result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.Message
  }

  async extract_hsse_email_attachment (email) {
    if (!email.HasAttachments) {
      return null
    }
    if (!email.Attachments.FileAttachment) {
      return null
    }
    let attachments = email.Attachments.FileAttachment instanceof Array ? email.Attachments.FileAttachment : [email.Attachments.FileAttachment]
    let Function = 'GetAttachment'
    let Args = {
      'AttachmentIds': {
        't:AttachmentId': attachments.map(item => item.AttachmentId)
      }
    }
    let result = await this.manager.run(Function, Args)
    if (!(result.ResponseMessages.GetAttachmentResponseMessage instanceof Array)) {
      result.ResponseMessages.GetAttachmentResponseMessage = [result.ResponseMessages.GetAttachmentResponseMessage]
    }
    return result.ResponseMessages.GetAttachmentResponseMessage.map(item => item.Attachments.FileAttachment)
  }

  async fetch_hsse_email(email) {
    let Function = 'GetItem';
    let Args = {
      "ItemShape": {
        't:BaseShape': 'AllProperties'
      },
      "ItemIds": {
        "t:ItemId": email.ItemId
      }
    }
    let result = await this.manager.run(Function, Args)
    let message = result.ResponseMessages.GetItemResponseMessage.Items.Message
    let attachments = await this.extract_hsse_email_attachment(message)
    return {
      message,
      attachments
    }
  }

  async fetch_hsse_email_list(limit = 10000) {
    let Function = 'FindItem';
    let Args = {
      'attributes': {
        'Traversal': 'Shallow'
      },
      'SortOrder': {
        't:FieldOrder': {
          'attributes': {
            'Order': 'Descending',
          },
          't:FieldURI': {
            'attributes': {
              'FieldURI': 'item:DateTimeReceived'
            }
          }
        }
      },
      'IndexedPageItemView': {
        'attributes': {
          'Offset': 0,
          'MaxEntriesReturned': limit,
          'BasePoint': 'Beginning'
        }
      },
      'ItemShape': {
        't:BaseShape': 'AllProperties'
      },
      'ParentFolderIds' : {
        'DistinguishedFolderId': {
          'attributes': {
            'Id': 'inbox'
          }
        }
      }
    };
    let result = await this.manager.run(Function, Args)
    return result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.Message
  }
}

module.exports = EWSEmailManager
