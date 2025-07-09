
export default {
  menu: {
    home: "Home",
    setting: "Settings",
    alert: "Alerts",
    accessSecurity: "Access Security",
    account: "Account",
    privilege: "Privilege",
    data: "Data",
    pid: "Process Diagram",
    roaming: "Roaming Path",
    dailyReport: "Daily Report",
    monthlyReport: "Monthly Report",
    ursReport: "URS Report",
    environmentReport: "Environment Report",
    cctv: "CCTV",
    hierarchy: "Models & Instances",
    models: "Model List",
    model: "Model Detail",
    instances: "Instances",
    instance: "Instance Detail",
    table: "Table Data",
    file: "Media File",
    map: "Map Tool",
    biEditor: "BI Dashboard",
    dashboard: "Dashboard",
    overviewDashboard: "Overview",
    productionDashboard: "Production",
    hsseDashboard: "HSSE",
    pidDashboard: "Process Diagram",
    energyManagement: "Energy Management",
    powerSaving: "Power Saving",
    malfunction: "Malfunction",
    maintenance: "Maintenance",
    graph: "Graph and Chart",
    device: "Device Automation",
    logbook: "Logbook",
  },
  model: {
    account: {
      name: "Name",
      username: "Login ID",
      internal: "Internal",
      email: "Email",
      phone: "Phone Number",
      job: "Job Title",
      password: "Password",
      department: "Department",
      role: "Role",
      status: "Status"
    },
    role: {
      name: "Name"
    },
    roaming: {
      name: "Name",
      stops: "Stops",
      settings: "Settings",
      longitude: "Longitude",
      latitude: "Latitude",
      altitude: "Altitude",
      heading: "Heading Angle",
      tilt: "Tilt Angle"
    },
    cctv: {
      name: "Name",
      src: "Source URL",
      resolution: "Resolution",
      fps: "FPS",
    },
    modelRelation: {
      source: "Source Model",
      type: "Type",
      target: "Target Model"
    },
    instance: {
      id: "ID",
      name: "Name",
      modelId: "Model ID",
      modelName: "Model Name",
      lastUpdatedAt: "Last Updated At"
    },
    instanceRelation: {
      source: "Source Instance",
      type: "Type",
      target: "Target Instance"
    },
    protocol: {
      name: "Name",
      protocol: "Protocol",
      interval: "Sample Interval",
      description: "Description",
      status: "Status",
      chains: "Rule Chains"
    },
    table: {
      name: "Name",
      dataType: "DataType",
      unique: "Unique",
      required: "Required",
      usage: "Usage",
      default: "Default Value",
      constraint: "Constraint",
      label: "Label",
      description: "Description"
    },
    tableRelation: {
      modelName: "Model Name",
      modelId: "Model ID",
      field: "Associated Field",
      instanceCount: "Instance Number",
    }
  },
  label: {
    basic: {
      action: "Action",
      file: "File",
      signOut: "Sign Out",
      setting: "Setting",
      password: "Reset Password",
      none: "None",
      custom: "Custom"
    },
    media: {
      shared: "Shared Documents",
      custom: "Custom Documents",
    },
    home: {
      stat: {
        general: "General Statistics",
        instance: "Entity",
        alert: "Alert Record",
        event: "Data Record",
        user: "Active User",
        seriesHistory: "Data Stat by Hour (Past Week)",
        instanceCount: "Entity Stat by Category",
        alertCalendar: "Alert Calendar",
        count: "Count",
        time: "Time",
        date: "Date",
      },
      application: "Application & Tools"
    },
    setting: {
      basic: "Basic",
      password: "Security",
      data: "Data"
    },
    privilege: {
      detail: "Privileges",
      super: "Super Admin"
    },
    roaming: {
      loop: "Loop",
      preview: "Preview",
      stopName: "Stop{index}",
      stopLocation: "Stop Location"
    },
    model: {
      setting: "Setting",
      instance: "Instances",
      name: "Model Name: {name}",
      label: "Label",
      id: "Model ID: {id}",
      attribute: "Static Attribute",
      series: "Time Series",
      relationship: "Relationship",
      document: "Document",
      '3d': "3D Template",
      ruleChain: "Rule Chain",
      alert: "Alert",
      table: "Table"
    },
    alertTemplate: {
      name: "Name",
      level: "Level",
      record: "Number of Record",
      checkRuleChain: "Rule Chain on Checking",
      user: "User in Charge",
      device: "Related instance",
    },
    alert: {
      name: "Name",
      level: "Level",
      time: "Time",
      status: "Status",
      subject: "Brief",
      content: "Content",
      location: "Location",
      instanceView: "Instance View",
      modelView: "Model View",
      recursive: "Recursive"
    },
    instance: {
      info: "<b>{name}</b> (ID: {id})",
      label: "Label",
      model: "Model: {name} (ID: {id})",
      attribute: "Static Attribute",
      series: "Time Series",
      relationship: "Relationship",
      ruleChain: "Rule Chain",
      table: "Table",
      pid: "PID",
      view: "3D View",
      alert: "Alert",
      protocol: "Protocol",
      history: "Historical Data",
      columnFilter: "Column Filter",
      allColumn: "All ({count}/{total})",
      document: "Document"
    },
    ruleChain: {
      model: "Model",
      testData: "Test Data"
    },
    protocol: {
      interface: "Server Interface",
      document: "Document",
      contentType: "Content Type"
    },
    pid: {
      instance: "Bind Instance",
      attribute: "Attributes",
      empty: "No Data",
      rule: "Rule List",
      default: "Default"
    },
    table: {
      setting: "Setting",
      detail: "Data",
      fields: "Fields",
      association: "Associated Models",
      name: "Table Name: {name}",
      sort: "Sort",
      filter: "Filter"
    },
    data: {
      name: "Name",
      dataType: "DataType",
      unique: "Unique",
      required: "Required",
      usage: "Usage",
      default: "Default Value",
      constraint: "Constraint",
      label: "Label",
      value: "Value",
      time: "Time",
      description: "Description",
      candidates: "Candidates:",
      minLength: "Min Length: {len}",
      maxLength: "Max Length: {len}",
      min: "Minimum: {value}",
      max: "Maximum: {value}",
      precision: "Precision: {value}",
      richtext: "Richtext",
      unit: "Unit: {unit}",
      content: "Detail Content"
    }
  },
  form: {
    title: {
      addAccount: "Add Account",
      editAccount: "Edit Account",
      resetPassword: "Reset Password",
      addRole: "Add Role",
      editRole: "Edit Role",
      assignRole: "Assign Role",
      addRoute: "New Route",
      editStop: "Edit Stop",
      addTable: "Create Table",
      editTable: "Edit Table",
      addField: "Add Field",
      editField: "Edit Field",
      addTableRelation: "Add Associated Model",
      addTableRecord: "Add Record",
      editTableRecord: "Edit Record",
      addRuleChain: "Add Rule Chain",
      editRuleChain: "Edit Rule Chain",
      bindRuleChain: "Bind Rule Chain",
      addAlertTemplate: "Add Alert Template",
      editAlertTemplate: "Edit Alert Template",
      addModel: "Add Model",
      editModel: "Edit Model",
      addGroup: "Add Group",
      renameGroup: "Rename Group",
      addAttribute: "Add Attribute",
      editAttribute: "Edit Attribute",
      addSeries: "Add Series",
      editSeries: "Edit Series",
      addModelRelation: "Add Model Relation",
      addInstanceRelation: "Add Instance Relation",
      addInstance: "Add Instance",
      editInstance: "Edit Instance",
      historyData: "History Data",
      addSeriesValue: "Add Series Record",
      editSeriesValue: "Edit Series Record",
      importData: "Import Data",
      uploadPID: "Upload PID",
      editPID: "Edit PID",
      renamePID: "Rename PID",
      previewPID: "Preview PID: {name}",
      addPIDRule: "Add PID Binding Rule",
      editPIDRule: "Edit PID Binding Rule",
      addAPI: "Create API",
      editAPI: "Edit API",
      setting: "System Setting",
      editRule: "Configure Rule"
    },
    signIn: {
      account: {
        label: "Account",
        placeholder: "Please input email or username."
      },
      password: {
        label: "Password",
        placeholder: "Please input password."
      }
    },
    setting: {
      basic: {
        label: "Basic",
        language: {
          label: "Language"
        },
        siteName: {
          label: "Site Name",
          placeholder: "Please specify site name for your deployed system."
        },
        mqtt: {
          label: "Default MQTT broker address",
          placeholder: "Please specify a valid MQTT broker address."
        },
        weather: {
          label: "Amap Weather API Key",
          placeholder: "Please provide your API Key"
        },
        cctv: {
          label: "Stream Server Address",
          placeholder: "Please specify the address of stream server."
        }
      },
      email: {
        label: "Email",
        smtp: {
          label: "SMTP Server",
          placeholder: "Please specify address of SMTP server."
        },
        port: {
          label: "Port"
        },
        ssl: {
          label: "SSL"
        },
        user: {
          label: "User",
          placeholder: "Please specify your account for sending emails."
        },
        password: {
          label: "Password",
          placeholder: "Please input password of your account"
        }
      },
      gis: {
        label: "GIS Service",
        model: {
          label: "Upload Model gLTF Files",
          action: "Select File",
          errors: {
            wrongType: "Please upload a zip file with a single entry named as model.gltf"
          }
        },
      },
      alert: {
        label: "Alert",
        siren: {
          label: "Siren Enabled"
        },
        file: {
          label: "Siren File"
        },
        interval: {
          label: "Interval between consecutive alerts"
        }
      }
    },
    account: {
      realName: {
        label: "Real Name",
        placeholder: "Please input user's real name",
        error: {
          empty: "Cannot be empty!"
        }
      },
      gender: {
        label: "Gender",
        error: {
          empty: "Cannot be empty!"
        }
      },
      username: {
        label: "Login ID",
        placeholder: "Please specify a login ID (6-32 characters).",
        error: {
          empty: "Login ID cannot be empty!",
          short: "Login ID is too short!",
          long: "Login ID is too long!"
        }
      },
      email: {
        label: "Email",
        placeholder: "Please specify an email address.",
        error: {
          invalid: "Invalid email address"
        }
      },
      phone: {
        label: "Phone Number",
        placeholder: "Please specify a phone number.",
        error: {
          invalid: "Invalid phone number."
        }
      },
      password: {
        label: "Password",
        placeholder: "Please specify password (6-32 characters).",
        error: {
          empty: "Password cannot be empty!",
          short: "Password is too short!",
          long: "Password is too long!"
        }
      },
      oldPassword: {
        label: "Password",
        placeholder: "Please input your password.",
        error: {
          empty: "Password cannot be empty!",
          short: "Password is too short!",
          long: "Password is too long!"
        }
      },
      newPassword: {
        label: "New Password",
        placeholder: "Please specify a new password (6-32 characters).",
        error: {
          empty: "Password cannot be empty!",
          short: "Password is too short!",
          long: "Password is too long!"
        }
      },
      confirmPassword: {
        label: "Confirm Password",
        placeholder: "Please input your password again.",
        error: {
          empty: "Password cannot be empty!",
          mismatch: "Password does not match!"
        }
      },
      role: {
        label: "Role",
        placeholder: "Please select a role.",
        error: {
          empty: "Role cannot be empty!",
        }
      }
    },
    role: {
      name: {
        label: "Name",
        placeholder: "Please specify a role name.",
        error: {
          empty: "Role name cannot be empty!"
        }
      },
      defaultEntry: {
        label: "Default Entry",
        placeholder: "Please provide a default entry path."
      }
    },
    roaming: {
      stopName: {
        label: "Custom Name",
        placeholder: "Please specify a name for this stop",
        error: {

        }
      },
      transition: {
        label: "Transition Duration",
        placeholder: "Transition duration from last stop to this stop.",
        error: {

        }
      },
      waiting: {
        label: "Waiting Time",
        placeholder: "Waiting time at this stop.",
        error: {

        }
      },
      related: {
        label: "Related Facility / Equipment",
        placeholder: "Please select a related facility / Equipment.",
      }
    },
    report: {
      date: {
        label: "Date",
        placeholder: "Please select a date.",
        error: {
          empty: "Please select a date."
        }
      },
      report: {
        label: "Report",
        placeholder: "Please select a report file.",
        error: {
          empty: "Please select a report file.",
          xlsxOnly: "Support .xlsx/.xlsm/.xls file only!",
          pdfOnly: "Support .pdf file only!",
        }
      }
    },
    model: {
      name: {
        label: "Name",
        placeholder: "Please specify model's name.",
        error: {
          empty: "Model name cannot be empty!"
        }
      },
      id: {
        label: "ID",
        placeholder: "Please specify model's ID.",
        error: {
          empty: "Model ID cannot be empty!"
        }
      },
      icon: {
        label: "Icon",
        error: {
          empty: "Icon cannot be empty!",
          invalid: "Support jpg/png/bmp only!"
        }
      },
      published: {
        label: "Published"
      }
    },
    modelGroup: {
      name: {
        label: "Name",
        placeholder: "Please specify a group name.",
        error: {
          empty: "Group name cannot be empty!"
        }
      }
    },
    ruleChain: {
      name: {
        label: "Name",
        placeholder: "Please specify a rule chain name.",
        error: {
          empty: "Name cannot be empty!"
        }
      },
      description: {
        label: "Description",
        placeholder: "Please specify a rule chain description.",
        error: {
          empty: "Description cannot be empty!"
        }
      }
    },
    alertTemplate: {
      name: {
        label: "Name",
        placeholder: "Please specify alert name.",
        error: {
          empty: "Name cannot be empty!"
        }
      },
      user: {
        label: "Users in Charge",
        placeholder: "Please specify users in charge of handling the task.",
      },
      device: {
        label: "Relevant instances",
        placeholder: "Please specify relevant instances.",
      },
      level: {
        label: "Level",
        placeholder: "Please specify alert level.",
        error: {
          empty: "Level cannot be empty!"
        }
      },
      color: {
        label: "Color",
        error: {
          empty: "Please select a color for your alert！"
        }
      },
      subject: {
        label: "Subject Template",
        placeholder: "Please specify your subject template.",
        error: {
          empty: "Cannot be empty!"
        }
      },
      template: {
        label: "content Template",
        placeholder: "Please specify your content template.",
        error: {
          empty: "Cannot be empty!"
        }
      },
    },
    modelRelation: {
      type: {
        label: "Type",
        placeholder: "Please select relation type",
        error: {
          empty: "Relation type cannot be empty!"
        }
      },
      target: {
        label: "Target Model",
        placeholder: "Please select target model",
        error: {
          empty: "Target model cannot be empty!"
        }
      }
    },
    instance: {
      id: {
        label: "ID",
        placeholder: "Please specify instance id",
        error: {
          empty: "Instance id cannot be empty!"
        }
      },
      name: {
        label: "Name",
        placeholder: "Please specify instance name",
        error: {
          empty: "Instance name cannot be empty!"
        }
      },
      viewPoint: {
        label: "View Point"
      },
      attribute: {
        placeholder: "Please specify value",
        error: {
          empty: "Cannot be empty!",
          invalidLength: "Invalid length!",
          invalid: "Invalid value!",
          integer: "Value is not an integer!",
          minimum: "Value is smaller than minimum limit ({min})!",
          maximum: "Value is larger than maximum limit ({max})!",
        }
      },
      published: {
        label: "Published"
      }
    },
    series: {
      time: {
        label: "Time",
        placeholder: "Please specify time",
        error: {
          empty: "Time cannot be empty!"
        }
      },
      value: {
        error: {
          invalid: "Please provide a valid value!"
        }
      },
      bulk: {
        error: {
          empty: "Please select an xlsx file first.",
          invalid: "Upload file must be in xlsx format."
        }
      }
    },
    pid: {
      name: {
        label: "Name",
        placeholder: "Please specify a diagram name.",
        error: {
          empty: "Diagram name cannot be empty!"
        }
      },
      file: {
        label: "File",
        placeholder: "Please select a svg file.",
        select: "Select File",
        error: {
          empty: "Please select a svg file.",
          svgOnly: "Support svg file only!"
        }
      },
      preview: {
        label: "Preview"
      }
    },
    protocol: {
      name: {
        label: "Name",
        placeholder: "Please specify API name",
        error: {
          empty: "Cannot be empty!"
        }
      },
      protocol: {
        label: "Protocol",
        placeholder: "Please select protocol",
        error: {
          empty: "Cannot be empty!"
        }
      },
      interval: {
        label: "Sample Interval",
        placeholder: "Please specify sample interval",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid value!"
        }
      },
      method: {
        label: "Method",
        placeholder: "Please select a method",
        error: {
          empty: "Cannot be empty!"
        }
      },
      address: {
        label: "Address",
        placeholder: "Please specify a url",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid address!"
        }
      },
      ip: {
        label: "IP Address",
        placeholder: "Please specify an IPV4 address",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid IPV4 address!"
        }
      },
      com: {
        label: "COM",
        placeholder: "",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid COM port!"
        }
      },
      baudrate: {
        label: "Baud Rate",
        placeholder: "Please select a baudrate",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid Baud rate!"
        }
      },
      port: {
        label: "Port",
        placeholder: "Please specify port",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid Port!"
        }
      },
      deviceAddress: {
        label: "Device Address",
        placeholder: "Please specify device address",
        error: {
          empty: "Cannot be empty!",
          invalid: "Invalid address!"
        }
      },
      header: {
        label: "Header",
        key: {
          label: "Key"
        },
        value: {
          label: "Value"
        },
        description: {
          label: "Description"
        }
      },
      channel: {
        label: "Channel",
        placeholder: "Please specify your channel.",
        error: {
          empty: "Channel cannot be empty!"
        }
      },
      dataType: {
        label: "Data Type",
        placeholder: "Please specify data type.",
        error: {
          empty: "Data type cannot be empty!"
        }
      },
      postAction: {
        label: "Post Action"
      },
      description: {
        label: "Description"
      }
    },
    table: {
      name: {
        label: "Name",
        placeholder: "Please specify a table name.",
        error: {
          empty: "Table name cannot be empty!"
        }
      }
    },
    field: {
      name: {
        label: "Name",
        placeholder: "Please specify a name.",
        error: {
          empty: "Name cannot be empty!"
        }
      },
      value: {
        error: {
          empty: "Value cannot be empty!",
          invalid: "Please provide a valid value."
        }
      },
      dataType: {
        label: "Data Type",
        placeholder: "Please select a data type.",
        error: {
          empty: "Data type cannot be empty!"
        }
      },
      required: {
        label: "Required?"
      },
      isVirtual: {
        label: "Virtual?"
      },
      calculationMethod: {
        label: "Calculation Method"
      },
      unique: {
        label: "Unique?"
      },
      filterable: {
        label: "Filterable?"
      },
      sortable: {
        label: "Sortable?"
      },
      richtext: {
        label: "Support Richtext?"
      },
      candidates: {
        label: "Candidates",
        placeholder: "Please specify candidates.",
        error: {
          empty: "Cannot be empty!"
        }
      },
      minLength: {
        label: "Min Length",
        placeholder: "Please specify a minimum length.",
      },
      maxLength: {
        label: "Max Length",
        placeholder: "Please specify a max length.",
      },
      minimum: {
        label: "Minimum",
        placeholder: "Please specify a minimum value.",
        error: {
          invalid: "Minimum is not a valid number!",
          integer: "Minimum is not an integer!",
          outOfRange: "Minimum is larger than maximum!"
        }
      },
      maximum: {
        label: "Maximum",
        placeholder: "Please specify a maximum value.",
        error: {
          invalid: "Maximum is not a valid number!",
          integer: "Maximum is not an integer!",
          outOfRange: "Maximum is smaller than minimum!"
        }
      },
      precision: {
        label: "Max Precision",
        placeholder: "Please specify a max precision.",
        error: {
          integer: "Precision is not an integer!",
          negative: "Precision should be positive!"
        }
      },
      default: {
        label: "Default Value",
        placeholder: "Please specify a default value."
      },
      unit: {
        label: "Unit",
        placeholder: "Please specify a unit."
      },
      realtime: {
        label: "Use Realtime?"
      },
      label: {
        label: "Label",
        placeholder: "Please specify label(s).",
      },
      description: {
        label: "Description",
        placeholder: "Describe meaning/usage.",
      }
    },
    tableRelation: {
      model: {
        label: "Associated Model",
        placeholder: "Please select an associated model.",
        error: {
          empty: "You must select an associated model!"
        }
      },
      field: {
        label: "Associated Field",
        placeholder: "Please select a field.",
        error: {
          empty: "You must select a field!"
        }
      }
    }
  },
  message: {
    gis: {
      loadingScene: "Loading Scene",
    },
    shared: {
      signIn: "Sign In To",
      signedIn: "Signed in successfully!",
      signOut: "Are you sure to sign out?",
      signedOut: "Signed out successfully!",
      confirm: "Action cannot be reversed, are you sure?",
      warning: "Warning",
      selectFile: "Please select a file"
    },
    setting: {
      updated: "Settings saved successfully!"
    },
    account: {
      activated: "Account {account} has been activated!",
      deactivated: "Account {account} has been deactivated!",
      passwordReset: "Password reset successfully.",
      created: "Account created successfully.",
      updated: "Account info updated successfully.",
    },
    role: {
      assigned: "Role assigned to selected account(s) successfully!",
      created: "Role created successfully!",
      privilegeUpdated: "Privilege updated successfully.",
      updated: "Role info saved successfully!",
      deleted: "Role deleted successfully!"
    },
    roaming: {
      updated: "Roaming path saved successfully!",
      deleted: "Route deleted successfully!",
      stopDeleted: "Route deleted successfully!",
      noStop: "Click {button} to record current stop.",
      atLeastOne: "Please provide at least 1 stop!",
      maxSpeed: "Already reached maximum speed!",
      finished: "Roaming finished!",
    },
    report: {
      uploaded: "Report uploaded successfully!",
      deleted: "Report deleted successfully!"
    },
    model: {
      empty: "No Model",
      haveAttachment: "Please delete attached model/group first!",
      selectModel: "Please select a model to view its information.",
      created: "Model created successfully!",
      updated: "Model info saved successfully!",
      deleted: "Model deleted successfully!",
      groupCreated: "Model group created successfully!",
      groupUpdated: "Model group info saved successfully!",
      groupDeleted: "Model group deleted successfully!",
    },
    attribute: {
      created: "Attribute created successfully!",
      updated: "Attribute info saved successfully!",
      deleted: "Attribute deleted successfully!"
    },
    series: {
      created: "Series created successfully!",
      updated: "Series info saved successfully!",
      deleted: "Series deleted successfully!",
      value: {
        created: "Record created successfully!",
        updated: "Data updated successfully!",
        deleted: "Record deleted successfully!",
        imported: "Record imported successfully!",
      }
    },
    ruleChain: {
      empty: "No rule chain.",
      updated: "Rule chain updated successfully!",
      created: "Rule chain created successfully!",
      deleted: "Rule chain deleted successfully!"
    },
    alertTemplate: {
      updated: "Alert template updated successfully!",
      created: "Alert template created successfully!",
      deleted: "Alert template deleted successfully!"
    },
    alert: {
      checked: "Alert checked successfully!"
    },
    pid: {
      empty: "Please upload a Process Diagram (svg format) first!",
      emptyRuleType: "Please select rule type first!",
      created: "PID uploaded successfully!",
      updated: "PID info updated successfully!",
      published: "PID published!",
      withdrawn: "PID withdrawn!",
      setAsDefault: "Current PID set as default!",
      noDefaultPID: "No PID set as default, please contact system admin!",
      deleted: "PID deleted successfully!"
    },
    protocol: {
      hint: "Write your code here",
      created: "API created successfully!",
      updated: "API updated successfully!",
      deleted: "API deleted successfully!"
    },
    modelRelation: {
      created: "Relation created successfully!",
      deleted: "Relation deleted successfully!"
    },
    instance: {
      created: "Instance created successfully!",
      updated: "Instance info saved successfully!",
      deleted: "Instance deleted successfully!"
    },
    table: {
      selectTable: "Please select a table to view its information.",
      empty: "No data table.",
      updated: "Table info saved successfully!",
      created: "Table created successfully!",
      deleted: "Table deleted successfully!",
    },
    tableRecord: {
      created: "Record created successfully!",
      updated: "Record updated successfully!",
      deleted: "Record deleted successfully!",
    },
    tableField: {
      created: "Field created successfully!",
      updated: "Field info saved successfully!",
      deleted: "Field deleted successfully!",
    },
    tableRelation: {
      created: "Associated model added successfully!",
      updated: "Relation info saved successfully!",
      deleted: "Relation deleted successfully!",
    },
    media: {
      uploaded: "File uploaded successfully!",
      deleted: "File deleted successfully!",
      downloaded: "File downloaded successfully!",
      empty: "No related file."
    }
  },
  action: {
    add: "Add",
    create: "Create",
    confirm: "Confirm",
    submit: "Submit",
    cancel: "Cancel",
    edit: "Edit",
    rename: "Rename",
    save: "Save",
    upload: "Upload",
    download: "Download",
    import: "Import",
    export: "Export",
    delete: "Delete",
    reset: "Reset",
    view: "View",
    close: "Close",
    select: "Select",
    publish: "Publish",
    withdraw: "Withdraw",
    locate: "Locate",
    preview: "Preview",
    back: "Back",
    signIn: "Sign In",
    test: "Test",
    manage: "Manage",
    configure: "Configure",
    resetPassword: "Reset Password",
    assignPrivilege: "Assign to Account",
    addGroup: "Add Group",
    addModel: "Add Model",
    downloadTemplate: "Download Template",
    alert: {
      check: "Check",
      sendEmail: "Send Email",
      sendSMS: "Send SMS",
      sendVoice: "Send Voice Notification"
    }
  },
  dict: {
    date: {
      ymdh: "MM/dd/yyyy hh",
      simple: "MM/dd/yyyy",
      full: "MM/dd/yyyy hh:mm:ss"
    },
    bool: {
      true: "Yes",
      false: "No"
    },
    status: {
      activated: "Activated",
      deactivated: "Deactivated",
      deleted: "Deleted"
    },
    month: {
      jan: "January",
      feb: "February",
      mar: "March",
      apr: "April",
      may: "May",
      jun: "June",
      jul: "July",
      aug: "August",
      sep: "September",
      oct: "October",
      nov: "November",
      dec: "December"
    },
    dataType: {
      String: "String",
      Text: "Text",
      Enum: "Enum",
      Integer: "Integer",
      Decimal: "Decimal",
      Date: "Date Only",
      Time: "Time Only",
      DateTime: "DateTime",
      Boolean: "Boolean/Binary",
      File: "File",
    },
    time: {
      second: "Second",
      minute: "Minute",
      hour: "Hour",
      day: "Day",
      week: "Week",
      month: "Month",
      year: "Year"
    },
    pidRuleType: {
      link: "Link",
      control: "Control",
      data: "Data",
      form: "Form",
      effect: "Data Effect"
    },
    alert: {
      status: {
        checked: "Checked",
        active: "Active"
      }
    },
    ruleChain: {
      group: {
        input: 'Input',
        processing: 'Processing',
        condition: 'Condition',
        action: 'Action',
        storage: 'Storage',
        other: 'Other'
      },
      widgets: {
        customCondition: {
          label: "Custom",
          description: "Write your own condition checker function."
        },
        input: {
          label: "Input",
          description: "Data received from device."
        },
        readAttributeValue: {
          label: "Read Attribute",
          description: "Read attribute values from database."
        },
        readSeriesLatestValue: {
          label: "Read Latest",
          description: "Read latest series value from database."
        },
        readSeriesHistoryValues: {
          label: "Read History",
          description: "Read historical series values from database."
        },
        transform: {
          label: "Transform",
          description: "Transform data as you wish."
        },
        threshold: {
          label: "Threshold",
          description: "Check if a value meets certain thresholds."
        },
        notifyDevice: {
          label: "Notify Device",
          description: "Notify Device through MQTT."
        },
        sendHTTP: {
          label: "HTTP Request",
          description: "Send HTTP request to third-party services."
        },
        sendBACNet: {
          label: "BACNet command",
          description: "Send BACNet command to targeted devices."
        },
        fireMalfunctionTask: {
          label: "Fire Malfunction Task",
          description: "Fire malfunction task and assign them to relevant people and devices."
        },
        firePowerSavingTask: {
          label: "Fire Power-saving Task",
          description: "Fire power saving task and assign them to relevant people and devices."
        },
        sendEmail: {
          label: "Send Email",
          description: "Send email."
        },
        sendSMS: {
          label: "Send SMS",
          description: "Send message through SMS."
        },
        sendVoice: {
          label: "Voice Notification",
          description: "Send voice notification through phone."
        },
        timer: {
          label: "Timer",
          description: "Execute a path with a certain period or at a certain time."
        },
        switch: {
          label: "Switch",
          description: "Condition check with multiple path."
        },
        heartbeat: {
          label: "Heartbeat",
          description: "Check if the device is online within certain timespan."
        },
        saveSQL: {
          label: "Write Relational Database",
          description: "Save data into relational database."
        },
        saveRedis: {
          label: "Write into Redis",
          description: "Save data into redis."
        },
        readRedis: {
          label: "Read from Redis",
          description: "Read data from redis."
        }
      }
    }
  },
  map: {
    walk: "Walk Mode",
    free: "Free Mode"
  }
}
