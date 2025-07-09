const Excel = require('exceljs')
const path = require('path')
const os = require('os')
require('./Date')()
const fs = require('fs').promises

class MonthlyDataExtractor {

    BASE_PATH = path.join(__dirname, '../', 'data', 'monthly')

    TYPE_MAP = {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-excel.sheet.macroEnabled.12': 'xlsm',
        'application/vnd.ms-excel': 'xls'
    }

    MIME_MAP = {
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        xls: 'application/vnd.ms-excel'
    }

    constructor() {
        this.workbooks = {}
    }

    async initialize () {
        this.workbooks = {}
        let filePattern = /([\d]+)-([\d]+) - Majnoon URS Submission - Production Report\.xls[xm]?/
        let files = (await fs.readdir(this.BASE_PATH)).filter(file => {
            let dateInfo = file.match(filePattern)
            if (dateInfo) {
                let date = new Date(parseInt(dateInfo[1]), parseInt(dateInfo[2]) - 1, 1)
                return !isNaN(date.getTime())
            }
            return false
        })
        for(let i = 0; i < files.length; i++) {
            let file = files[i]
            let dateInfo = file.match(filePattern)
            let date = new Date(parseInt(dateInfo[1]), parseInt(dateInfo[2]) - 1, 1)
            this.workbooks[date.format('yyyy-MM')] = await (new Excel.Workbook().xlsx.readFile(path.join(this.BASE_PATH, file)))
        }
    }

    async downloadFile (date) {
        for(let key in this.MIME_MAP) {
            try {
                let fileName = `${date.format('yyyy-MM')} - Majnoon URS Submission - Production Report.${key}`
                return {
                    mime: this.MIME_MAP[key],
                    data: await fs.readFile(path.join(this.BASE_PATH, fileName))
                }
            } catch (e) {}
        }
    }

    async insertReport (date, file) {
        if (this.TYPE_MAP[file.type]) {
            let fileName = `${date.format('yyyy-MM')} - Majnoon URS Submission - Production Report.${this.TYPE_MAP[file.type]}`
            await fs.copyFile(file.path, path.join(this.BASE_PATH, fileName))
            this.workbooks[date.format('yyyy-MM')] = await (new Excel.Workbook().xlsx.readFile(path.join(this.BASE_PATH, fileName)))
        }
    }

    async deleteFile (date) {
        try {
            for(let key in this.MIME_MAP) {
                try {
                    let fileName = `${date.format('yyyy-MM')} - Majnoon URS Submission - Production Report.${key}`
                    await fs.unlink(path.join(this.BASE_PATH, fileName))
                } catch (e) {}
            }
        }
        catch (err) {}
        delete this.workbooks[date.format('yyyy-MM')]
    }

    filterByDate(startDate, endDate) {
        let result = {}
        for(let dateStr in this.workbooks) {
            let date = new Date(dateStr)
            if (startDate && endDate && date >= startDate && date <= endDate) {
                result[dateStr] = this.workbooks[dateStr]
            }
            else if (startDate && !endDate && date >= startDate) {
                result[dateStr] = this.workbooks[dateStr]
            }
            else if (!startDate && endDate && date <= endDate) {
                result[dateStr] = this.workbooks[dateStr]
            }
            else {
                result[dateStr] = this.workbooks[dateStr]
            }
        }
        return result
    }

    async getCellsFromSingleSheet (sheet, rowStart, rowEnd, columnStart, columnEnd) {
        rowStart = rowStart ? rowStart : 1
        rowEnd = rowEnd ? rowEnd : sheet.rowCount
        columnStart = columnStart ? columnStart : 1
        columnEnd = columnEnd ? columnEnd : row.cellCount
        return sheet.getRows(rowStart, rowEnd - rowStart + 1).map(row => {
            let span = []
            for(let i = columnStart; i <= columnEnd; i++) {
                span.push(row.getCell(i).value)
            }
            return span
        })
    }

    async getCells(startDate, endDate, sheet, rowStart, rowEnd, columnStart, columnEnd) {
        let workbooks = this.filterByDate(startDate, endDate)
        let data = Object.assign({}, workbooks)
        for(let key in data) {
            data[key] = await this.getCellsFromSingleSheet(data[key].getWorksheet(sheet), rowStart, rowEnd, columnStart, columnEnd)
        }
        return data
    }
}

module.exports = MonthlyDataExtractor
