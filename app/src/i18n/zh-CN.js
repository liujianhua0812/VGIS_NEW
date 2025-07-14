
export default {
  menu: {
    home: "首页",
    setting: "系统设置",
    alert: "告警管理",
    accessSecurity: "安全管理",
    account: "账号",
    privilege: "权限",
    data: "数据管理",
    roaming: "飞行路径",
    pid: "流程图实时监控",
    dailyReport: "生产日报",
    monthlyReport: "生产月报",
    ursReport: "安防月报",
    environmentReport: "环境监测月报",
    cctv: "视频监控",
    hierarchy: "模型 & 对象管理",
    models: "模型管理",
    model: "模型详情",
    instances: "对象管理",
    instance: "对象详情",
    table: "数据表管理",
    file: "文件管理",
    map: "地图浏览",
    biEditor: "BI数据面板",
    dashboard: "数据大屏",
    overviewDashboard: "全局概况",
    productionDashboard: "生产监控",
    hsseDashboard: "安防监控",
    pidDashboard: "实时监控",
    energyManagement: "能碳管理",
    powerSaving: "节能管理",
    malfunction: "故障管理",
    maintenance: "维保管理",
    graph: "报表管理",
    device: "设备管理",
    logbook: "系统日志",
  },
  model: {
    account: {
      name: "姓名",
      gender: "性别",
      username: "用户名",
      internal: "内部用户",
      email: "邮箱",
      phone: "电话号码",
      job: "岗位",
      password: "密码",
      photo: "照片",
      fingerprint: "指纹",
      department: "部门",
      role: "角色",
      status: "激活状态"
    },
    role: {
      name: "模块"
    },
    roaming: {
      name: "名称",
      stops: "轨迹",
      settings: "配置",
      longitude: "经度",
      latitude: "纬度",
      altitude: "高度",
      heading: "偏转角",
      tilt: "俯仰角"
    },
    cctv: {
      name: "名称",
      src: "视频流地址",
      resolution: "分辨率",
      fps: "帧率",
    },
    modelRelation: {
      source: "源模型",
      type: "关系类型",
      target: "目标模型"
    },
    instance: {
      id: "编号",
      name: "名称",
      modelId: "模型编号",
      modelName: "模型名称",
      lastUpdatedAt: "最近一次数据更新"
    },
    instanceRelation: {
      source: "源对象",
      type: "关系类型",
      target: "目标对象"
    },
    protocol: {
      name: "名称",
      protocol: "协议",
      interval: "采样间隔",
      description: "说明",
      status: "状态",
      chains: "规则链"
    },
    table: {
      name: "名称",
      dataType: "类型",
      unique: "唯一",
      required: "必填",
      usage: "用途",
      default: "默认值",
      constraint: "约束",
      label: "标签",
      description: "描述",
    },
    tableRelation: {
      modelName: "模型名称",
      modelId: "模型ID",
      field: "关联字段",
      instanceCount: "实例数量",
    }
  },
  label: {
    basic: {
      action: "操作",
      file: "文件",
      signOut: "登出",
      setting: "设置",
      password: "重置密码",
      none: "无",
      custom: "自定义"
    },
    media: {
      shared: "共享文档",
      custom: "对象专属文档",
    },
    home: {
      stat: {
        general: "基本情况",
        instance: "物模型数量",
        alert: "告警数量",
        event: "数据总量",
        user: "活跃用户",
        seriesHistory: "近一周数据情况",
        instanceCount: "物模型数量（按类别）",
        alertCalendar: "告警日历",
        count: "数量",
        time: "时间",
        date: "日期",
      },
      application: "应用工具"
    },
    setting: {
      basic: "基础设置",
      password: "修改密码",
      data: "数据连接设置"
    },
    privilege: {
      detail: "权限清单",
      super: "超级管理员",
    },
    roaming: {
      loop: "循环飞行",
      preview: "预览",
      stopName: "站点{index}",
      location: "位置信息"
    },
    model: {
      setting: "配置",
      instance: "对象",
      label: "标记",
      name: "名称：{name}",
      id: "编号：{id}",
      attribute: "静态属性",
      series: "时序点位",
      relationship: "层级关系",
      document: "文档",
      '3d': "三维模板",
      table: "关联数据表",
      ruleChain: "规则链",
      alert: "告警",
    },
    alertTemplate: {
      name: "名称",
      level: "等级",
      record: "事件数量",
      checkRuleChain: "规则链（确认时触发）",
      user: "关联人员",
      device: "关联设备设施",
    },
    alert: {
      name: "事件",
      level: "等级",
      time: "时间",
      status: "状态",
      subject: "概要",
      content: "详情",
      location: "地点",
      instanceView: "实体视图",
      modelView: "类型视图",
      recursive: "包含子实体"
    },
    instance: {
      info: "<b>{name}</b>（ID：{id}）",
      model: "模型: {name}（ID：{id}）",
      label: "标记",
      attribute: "静态属性",
      series: "时序点位",
      relationship: "层级关系",
      table: "关联数据表",
      ruleChain: "规则链",
      pid: "流程图",
      alert: "告警记录",
      view: "3D视图",
      protocol: "传输协议",
      history: "历史数据",
      columnFilter: "列筛选器",
      allColumn: "全部（{count}/{total}）",
      fieldWithUnit: "{name}（{unit}）",
      document: "文档"
    },
    ruleChain: {
      model: "Model",
      testData: "测试数据"
    },
    protocol: {
      interface: "服务端接口",
      document: "说明文档",
      contentType: "数据类型"
    },
    pid: {
      instance: "绑定对象",
      attribute: "图形属性",
      empty: "暂无数据",
      rule: "规则列表",
      default: "默认"
    },
    table: {
      setting: "配置",
      detail: "数据",
      fields: "字段",
      association: "关联模型",
      name: "数据表：{name}",
      sort: "排序器",
      filter: "筛选器"
    },
    data: {
      name: "名称",
      dataType: "类型",
      unique: "唯一",
      required: "必填",
      usage: "用途",
      default: "默认值",
      constraint: "约束",
      label: "标签",
      time: "时间",
      value: "值",
      description: "描述",
      candidates: "可选值：",
      minLength: "长度下限：{len}",
      maxLength: "长度上限：{len}",
      min: "最小值：{value}",
      max: "最大值：{value}",
      precision: "精度：{value}",
      richtext: "富文本",
      unit: "单位：{unit}",
      content: "详细内容"
    }
  },
  form: {
    title: {
      addAccount: "新建账号",
      editAccount: "编辑账号信息",
      resetPassword: "重置密码",
      addRole: "新建角色",
      editRole: "修改信息",
      assignRole: "分配到账号",
      addRoute: "新建飞行路径",
      editStop: "配置站点信息",
      addTable: "新建数据表",
      editTable: "编辑数据表",
      addField: "新建字段",
      editField: "修改字段信息",
      addTableRelation: "添加关联模型",
      addTableRecord: "添加数据记录",
      editTableRecord: "修改数据记录",
      addRuleChain: "添加规则链",
      editRuleChain: "修改规则链",
      bindRuleChain: "关联规则链",
      addAlertTemplate: "添加告警模板",
      editAlertTemplate: "编辑告警模板",
      addModel: "新建模型",
      editModel: "编辑模型",
      addGroup: "新建分组",
      renameGroup: "重命名分组",
      addAttribute: "添加静态属性",
      editAttribute: "修改静态属性",
      addSeries: "添加时序点位",
      editSeries: "修改时序点位",
      addModelRelation: "添加层级关系",
      editModelRelation: "修改层级关系",
      addInstanceRelation: "添加层级关系",
      historyData: "历史数据",
      addSeriesValue: "添加时序记录",
      editSeriesValue: "修改时序记录",
      importData: "导入数据",
      uploadPID: "上传流程图",
      editPID: "修改流程图信息",
      renamePID: "重命名流程图",
      previewPID: "预览流程图视效：{name}",
      addPIDRule: "添加流程图点位规则",
      editPIDRule: "修改流程图点位规则",
      addAPI: "添加API",
      editAPI: "修改API",
      setting: "系统设置",
      editRule: "配置规则"
    },
    signIn: {
      account: {
        label: "账号",
        placeholder: "请输入邮箱或用户名"
      },
      password: {
        label: "密码",
        placeholder: "请输入密码"
      }
    },
    setting: {
      basic: {
        label: "基础配置",
        language: {
          label: "语言",
        },
        siteName: {
          label: "网站名称",
          placeholder: "请根据您部署的场景设置网站名称"
        },
        mqtt: {
          label: "默认MQTT Broker地址",
          placeholder: "请输入合法的MQTT Broker地址"
        },
        weather: {
          label: "天气服务API Key",
          placeholder: "请输入高德Web天气服务的API Key"
        },
        cctv: {
          label: "流媒体服务器地址",
          placeholder: "请输入流媒体服务器的地址"
        },
      },
      email: {
        label: "邮件设置",
        smtp: {
          label: "SMTP服务",
          placeholder: "请设置SMTP服务器的地址"
        },
        port: {
          label: "端口"
        },
        ssl: {
          label: "启用SSL"
        },
        user: {
          label: "发送邮箱",
          placeholder: "请设置发送用的邮箱。"
        },
        password: {
          label: "密码",
          placeholder: "请输入发送邮箱使用的客户端密码。"
        }
      },
      gis: {
        label: "GIS服务器配置",
        model: {
          label: "模型文件上传",
          action: "选择文件",
          errors: {
            wrongType: "请上传根下包含model.gltf文件的zip文件包！"
          }
        },
      },
      alert: {
        label: "告警配置",
        siren: {
          label: "包含声音"
        },
        file: {
          label: "声音文件"
        },
        interval: {
          label: "连续报警间隔"
        }
      }
    },
    account: {
      realName: {
        label: "真实姓名",
        placeholder: "请输入账号的真实姓名",
        error: {
          empty: "姓名不可为空！"
        }
      },
      gender: {
        label: "性别",
        error: {
          empty: "性别不可为空！"
        }
      },
      username: {
        label: "用户名",
        placeholder: "请输入用户名（6—32个字符）",
        error: {
          empty: "用户名不可为空！",
          short: "用户名过短！",
          long: "用户名过长！"
        }
      },
      email: {
        label: "邮箱",
        placeholder: "请输入电子邮箱地址。",
        error: {
          invalid: "请输入格式正确的电子邮箱地址！"
        }
      },
      phone: {
        label: "电话号码",
        placeholder: "请输入电话号码。",
        error: {
          invalid: "请输入格式正确的电话号码！"
        }
      },
      // 新增部门、照片、岗位、指纹等信息
      job: {
        label: "岗位",
        placeholder: "请输入岗位。",
        error: {
          invalid: "请输入格式正确的岗位！"
        }
      },
      photo: {
        label: "照片",
        placeholder: "请输入照片。",
        error: {
          invalid: "请输入格式正确的照片！"
        }
      },
      department: {
        label: "部门",
        placeholder: "请输入部门。",
        error: {
          invalid: "请输入格式正确的部门！"
        }
      },
      fingerprint: {
        label: "指纹",
        placeholder: "请输入指纹。",
        error: {
          invalid: "请输入格式正确的指纹！"
        }
      },
      //  新增内容结束
      password: {
        label: "密码",
        placeholder: "请设置密码（6—32个字符）",
        error: {
          empty: "密码不可为空！",
          short: "密码过短！",
          long: "密码过长！"
        }
      },
      oldPassword: {
        label: "密码",
        placeholder: "请输入当前账号使用的密码",
        error: {
          empty: "密码不可为空！",
          short: "密码过短！",
          long: "密码过长！"
        }
      },
      newPassword: {
        label: "新密码",
        placeholder: "请设置新密码（6—32个字符）",
        error: {
          empty: "密码不可为空！",
          short: "密码过短！",
          long: "密码过长！"
        }
      },
      confirmPassword: {
        label: "确认密码",
        placeholder: "请再次输入密码",
        error: {
          empty: "请再次输入密码！",
          mismatch: "两次密码输入不一致！"
        }
      },
      role: {
        label: "角色",
        placeholder: "请选择账号角色",
        error: {
          empty: "请选择账号角色！"
        }
      }
    },
    role: {
      name: {
        label: "角色名称",
        placeholder: "请设置角色名称",
        error: {
          empty: "不可为空！"
        }
      },
      defaultEntry: {
        label: "登入后跳转地址",
        placeholder: "登入系统后跳转的页面地址，默认为后台首页"
      }
    },
    roaming: {
      stopName: {
        label: "站点名称",
        placeholder: "自定义的站点名称",
        error: {

        }
      },
      transition: {
        label: "飞行时间",
        placeholder: "从上一个站点到该站点的飞行时间",
        error: {

        }
      },
      waiting: {
        label: "驻留时间",
        placeholder: "停留在该站点的时间",
        error: {

        }
      },
      related: {
        label: "关联设施/设备",
        placeholder: "请选择关联的设施/设备",
      }
    },
    report: {
      date: {
        label: "日期",
        placeholder: "请选择报告对应的日期",
        error: {
          empty: "请选择日期"
        }
      },
      report: {
        label: "报告文件",
        placeholder: "请选择报告文件",
        error: {
          empty: "请选择报告文件",
          xlsxOnly: "仅支持.xlsx/.xlsm/.xls格式的文件！",
          pdfOnly: "仅支持.pdf格式的文件！",
        }
      }
    },
    model: {
      name: {
        label: "模型名称",
        placeholder: "请输入模型名称",
        error: {
          empty: "模型名称不可为空！"
        }
      },
      id: {
        label: "编号",
        placeholder: "请输入模型编号",
        error: {
          empty: "模型编号不可为空！"
        }
      },
      icon: {
        label: "图标",
        error: {
          empty: "请选择图标！",
          invalid: "仅支持jpg/png/bmp格式的图片！"
        }
      },
      published: {
        label: "已发布"
      }
    },
    modelGroup: {
      name: {
        label: "分组名称",
        placeholder: "请输入分组名称",
        error: {
          empty: "分组名称不可为空！"
        }
      }
    },
    ruleChain: {
      name: {
        label: "名称",
        placeholder: "请设置规则链名称。",
        error: {
          empty: "名称不可为空！"
        }
      },
      description: {
        label: "说明",
        placeholder: "请为规则链写一段简要说明。",
        error: {
          empty: "说明不可为空！"
        }
      }
    },
    alertTemplate: {
      name: {
        label: "名称",
        placeholder: "请设置告警名称",
        error: {
          empty: "名称不可为空！"
        }
      },
      user: {
        label: "处理人",
        placeholder: "请设置处理人",
      },
      device: {
        label: "关联设备设置",
        placeholder: "请设置关联设备设置",
      },
      level: {
        label: "等级",
        placeholder: "请设置告警等级",
        error: {
          empty: "等级不可为空！"
        }
      },
      color: {
        label: "等级颜色",
        error: {
          empty: "请为告警等级设置颜色！"
        }
      },
      subject: {
        label: "摘要模板",
        placeholder: "请设置摘要模板",
        error: {
          empty: "摘要模板不可为空！"
        }
      },
      template: {
        label: "内容模板",
        placeholder: "请设置告警内容模板",
        error: {
          empty: "内容模板不可为空！"
        }
      },
    },
    modelRelation: {
      type: {
        label: "关系类型",
        placeholder: "请选择关系类型",
        error: {
          empty: "关系类型不可为空！"
        }
      },
      target: {
        label: "目标模型",
        placeholder: "请选择目标模型",
        error: {
          empty: "目标模型不可为空！"
        }
      }
    },
    instance: {
      id: {
        label: "编号",
        placeholder: "请设置对象编号",
        error: {
          empty: "编号不可为空！"
        }
      },
      name: {
        label: "名称",
        placeholder: "请设置对象名称",
        error: {
          empty: "名称不可为空！"
        }
      },
      viewPoint: {
        label: "观察视点"
      },
      attribute: {
        placeholder: "请设置属性值",
        error: {
          empty: "不可为空！",
          invalidLength: "长度非法！",
          invalid: "非法取值！",
          integer: "应为整数！",
          minimum: "数值应不小于{min}！",
          maximum: "数值应不大鱼{max}！",
        }
      },
      published: {
        label: "已发布"
      }
    },
    series: {
      time: {
        label: "时间",
        placeholder: "请选择时间",
        error: {
          empty: "请选择时间！"
        }
      },
      value: {
        error: {
          invalid: "请提供一个合法的值！"
        }
      },
      bulk: {
        error: {
          empty: "清选择待导入的excel文件！",
          invalid: "文件必须为Excel格式！"
        }
      }
    },
    pid: {
      name: {
        label: "名称",
        placeholder: "请设置流程图名称",
        error: {
          empty: "流程图名称不可为空！"
        }
      },
      file: {
        label: "原始文件",
        placeholder: "请选择SVG格式的流程图文件",
        select: "请选择",
        error: {
          empty: "请选择文件！",
          svgOnly: "仅支持SVG格式！"
        }
      },
      preview: {
        label: "预览"
      },
      rules: {
        link: {
          target: {
            label: "目标流程图",
            error: {
              empty: "请选择一个目标流程图！"
            }
          },
          type: {
            label: "跳转方式",
            popping: "弹窗",
            redirect: "跳转",
            tab: "新标签页",
            error: {
              empty: "请选择跳转方式！"
            }
          }
        },
        data: {
          type: {
            label: "数据类型",
            attribute: "静态属性",
            series: "时序点位",
            error: {
              empty: "请选择数据类型！"
            }
          },
          realtime: {
            label: "实时刷新",
          },
          attribute: {
            label: "静态属性",
            error: {
              empty: "请选择静态属性！"
            }
          },
          series: {
            label: "时序点位",
            error: {
              empty: "请选择时序点位！"
            }
          },
          instance: {
            label: "绑定对象",
            error: {
              empty: "请选择绑定的对象！"
            }
          },
          emptyText: {
            label: "空值占位符",
            placeholder: "请设置占位符！"
          },
          period: {
            label: "刷新周期",
            placeholder: "请设置刷新周期！",
            error: {
              empty: "刷新周期不可为空！",
              invalid: "请设置合法的刷新周期！"
            }
          }
        },
        form: {
          type: {
            label: "数据类型",
            attribute: "静态属性",
            series: "时序点位",
            error: {
              empty: "请选择数据类型！"
            }
          },
          trigger: {
            label: "触发方式",
            click: "鼠标左键单击",
            dblclick: "鼠标左键双击",
            error: {
              empty: "请设置表单的触发方式！"
            }
          },
          attribute: {
            label: "静态属性",
            error: {
              empty: "请选择静态属性！"
            }
          },
          series: {
            label: "时序点位",
            error: {
              empty: "请选择时序点位！"
            }
          },
          instance: {
            label: "绑定对象",
            error: {
              empty: "请选择绑定的对象！"
            }
          }
        },
        control: {
          instance: {
            label: "绑定对象",
            error: {
              empty: "请选择绑定的对象！"
            }
          },
          chain: {
            label: "触发逻辑组",
            error: {
              empty: "请设置触发逻辑组！"
            }
          },
          validator: {
            label: "身份验证模式",
            none: "不验证",
            role: "系统权限",
            users: "指定用户",
            password: "密码",
            fingerprint: "指纹",
            error: {
              empty: "请设置身份验证模式！"
            }
          },
          password: {
            label: "密码",
            placeholder: "请设置密码",
            error: {
              empty: "密码不可为空！"
            }
          },
          confirmPassword: {
            label: "确认密码",
            placeholder: "请再次输入密码",
            error: {
              empty: "不可为空！",
              mismatch: "两次密码不匹配！"
            }
          },
        },
        effect: {
          type: {
            label: "数据类型",
            attribute: "静态属性",
            series: "时序点位",
            error: {
              empty: "请选择数据类型！"
            }
          },
          controller: {
            label: "控制逻辑",
            placeholder: "在此根据数值（data）来调整目标节点（node）的视效"
          },
          realtime: {
            label: "实时刷新",
          },
          attribute: {
            label: "静态属性",
            error: {
              empty: "请选择静态属性！"
            }
          },
          series: {
            label: "时序点位",
            error: {
              empty: "请选择时序点位！"
            }
          },
          instance: {
            label: "绑定对象",
            error: {
              empty: "请选择绑定的对象！"
            }
          },
          emptyText: {
            label: "空值占位符",
            placeholder: "请设置占位符！"
          },
          period: {
            label: "刷新周期",
            placeholder: "请设置刷新周期！",
            error: {
              empty: "刷新周期不可为空！",
              invalid: "请设置合法的刷新周期！"
            }
          }
        }
      }
    },
    protocol: {
      name: {
        label: "接口名",
        placeholder: "请设置接口名",
        error: {
          empty: "接口名不可为空！"
        }
      },
      protocol: {
        label: "协议",
        placeholder: "请选择协议",
        error: {
          empty: "协议不可为空！"
        }
      },
      interval: {
        label: "采样间隔",
        placeholder: "请设置采样间隔",
        error: {
          empty: "采样间隔不可为空！",
          invalid: "请设置合法的采样间隔！"
        }
      },
      method: {
        label: "请求方法",
        placeholder: "请选择请求方法",
        error: {
          empty: "请求方法不可为空！"
        }
      },
      address: {
        label: "地址",
        placeholder: "请设置地址",
        error: {
          empty: "地址不可为空！",
          invalid: "请设置合法的地址！"
        }
      },
      ip: {
        label: "IP地址",
        placeholder: "请设置IP地址",
        error: {
          empty: "IP地址不可为空！",
          invalid: "请设置合法的IP地址！"
        }
      },
      com: {
        label: "COM端口",
        placeholder: "请设置COM端口",
        error: {
          empty: "COM端口不可为空！",
          invalid: "请设置合法的COM端口！"
        }
      },
      baudrate: {
        label: "波特率",
        placeholder: "请设置波特率",
        error: {
          empty: "波特率不可为空！",
          invalid: "请设置合法的波特率！"
        }
      },
      port: {
        label: "端口号",
        placeholder: "请设置端口号",
        error: {
          empty: "端口号不可为空！",
          invalid: "请设置合法的端口号！"
        }
      },
      deviceAddress: {
        label: "设备地址",
        placeholder: "请设置设备地址",
        error: {
          empty: "设备地址不可为空！",
          invalid: "请设置合法的设备地址！"
        }
      },
      header: {
        label: "请求头",
        key: {
          label: "键"
        },
        value: {
          label: "值"
        },
        description: {
          label: "说明"
        }
      },
      channel: {
        label: "目标Channel",
        placeholder: "请输入目标Channel",
        error: {
          empty: "Channel不可为空！"
        }
      },
      dataType: {
        label: "数据类型",
        placeholder: "请选择数据类型.",
        error: {
          empty: "数据类型不可为空！"
        }
      },
      postAction: {
        label: "接收数据回调"
      },
      description: {
        label: "接口描述"
      }
    },
    table: {
      name: {
        label: "名称",
        placeholder: "请输入数据表名称",
        error: {
          empty: "数据表名称不可为空！"
        }
      }
    },
    field: {
      name: {
        label: "名称",
        placeholder: "请输入名称",
        error: {
          empty: "名称不可为空！"
        }
      },
      value: {
        error: {
          empty: "取值不可为空！",
          invalid: "清设置一个合法的取值！"
        }
      },
      dataType: {
        label: "数据类型",
        placeholder: "请选择数据类型",
        error: {
          empty: "数据类型不可为空！"
        }
      },
      required: {
        label: "是否必填？"
      },
      isVirtual: {
        label: "计算字段？"
      },
      calculationMethod: {
        label: "计算方法"
      },
      unique: {
        label: "是否唯一？"
      },
      filterable: {
        label: "用作筛选器？"
      },
      sortable: {
        label: "用作排序器？"
      },
      richtext: {
        label: "支持富文本？"
      },
      candidates: {
        label: "取值范围",
        placeholder: "请设置候选值",
        error: {
          empty: "请至少设置一个候选值！"
        }
      },
      minLength: {
        label: "长度下限",
        placeholder: "请设置长度下限",
      },
      maxLength: {
        label: "长度上限",
        placeholder: "请设置长度上限",
      },
      minimum: {
        label: "最小值",
        placeholder: "请设置最小取值",
        error: {
          invalid: "请输入合法的数值！",
          integer: "请输入整数！",
          outOfRange: "超过了最大值！"
        }
      },
      maximum: {
        label: "最大值",
        placeholder: "请设置最大取值",
        error: {
          invalid: "请输入合法的数值！",
          integer: "请输入整数！",
          outOfRange: "超过了最小值！"
        }
      },
      precision: {
        label: "最大精度",
        placeholder: "请设置最大精度",
        error: {
          integer: "精度必须是整数！",
          negative: "精度应为不小于0的整数！"
        }
      },
      default: {
        label: "默认值",
        placeholder: "请设置默认值"
      },
      unit: {
        label: "单位",
        placeholder: "请设置单位"
      },
      realtime: {
        label: "即时取值？"
      },
      label: {
        label: "标签",
        placeholder: "清设置标签以方便日后归类"
      },
      description: {
        label: "描述",
        placeholder: "请解释该含义及用途"
      }
    },
    tableRelation: {
      model: {
        label: "关联模型",
        placeholder: "请选择关联模型",
        error: {
          empty: "请选择关联模型！"
        }
      },
      field: {
        label: "关联字段",
        placeholder: "请选择关联字段",
        error: {
          empty: "请选择关联字段！"
        }
      }
    }
  },
  message: {
    gis: {
      loadingScene: "场景加载中",
    },
    shared: {
      signIn: "用户登录",
      signOut: "确定要登出系统吗？",
      signedOut: "登出成功!",
      confirm: "操作不可撤销，确定吗？",
      warning: "警告",
      selectFile: "请选择一个文件"
    },
    setting: {
      updated: "设置已生效！"
    },
    account: {
      activated: "账号 {account} 已激活！",
      deactivated: "账号 {account} 已注销！",
      passwordReset: "密码已成功重置！",
      created: "账号添加成功！",
      updated: "账号修改成功！",
    },
    role: {
      assigned: "已成功为选中账号分配角色！",
      created: "角色创建成功！",
      privilegeUpdated: "权限配置成功！",
      updated: "角色已修改！",
      deleted: "角色已删除！"
    },
    roaming: {
      updated: "飞行路径信息已成功保存！",
      deleted: "飞行路径已成功删除！",
      stopDeleted: "巡检站点已成功删除！",
      noStop: "点击{button}记录巡检点位",
      atLeastOne: "清至少记录一个巡检点位！",
      maxSpeed: "已经是最大加速倍率了！",
      finished: "巡检结束！"
    },
    report: {
      uploaded: "报告已成功上传！",
      deleted: "报告已成功删除！"
    },
    model: {
      empty: "暂无",
      haveAttachment: "请先删除下属的模型/分组！",
      selectModel: "请先选择一个模型",
      created: "模型创建成功！",
      updated: "模型修改成功！",
      deleted: "模型已成功删除！",
      groupCreated: "分组创建成功！",
      groupUpdated: "分组名称修改成功！",
      groupDeleted: "分组已成功删除！",
    },
    attribute: {
      created: "属性创建成功！",
      updated: "属性修改成功！",
      deleted: "属性已成功删除！",
    },
    series: {
      created: "点位创建成功！",
      updated: "点位修改成功！",
      deleted: "点位已成功删除！",
      value: {
        created: "数据记录成功！",
        updated: "数据更新成功！",
        deleted: "数据删除成功！",
        imported: "数据导入成功！",
      }
    },
    ruleChain: {
      empty: "暂无规则链",
      updated: "规则链已更新！",
      created: "规则链已创建！",
      deleted: "规则链已删除！",
      executed: "已执行！",
    },
    alertTemplate: {
      updated: "告警模板已更新！",
      created: "告警模板已创建！",
      deleted: "告警模板已删除！"
    },
    alert: {
      checked: "告警已确认！"
    },
    pid: {
      empty: "请先上传流程图文件 (svg格式)！",
      emptyRuleType: "请先选择规则类型！",
      created: "流程图上传成功！",
      updated: "流程图修改成功！",
      published: "流程图发布成功！",
      withdrawn: "流程图已撤销发布！",
      setAsDefault: "已设置成默认流程图！",
      noDefaultPID: "未设置默认流程图，请联系管理员！",
      deleted: "流程图已成功删除！"
    },
    protocol: {
      hint: "在此写代码",
      created: "API添加成功！",
      updated: "修改已生效！",
      deleted: "API已删除！"
    },
    modelRelation: {
      created: "层级关系添加成功！",
      deleted: "层级关系删除成功！",
    },
    table: {
      selectTable: "请先选择一张数据表.",
      empty: "暂无",
      updated: "数据表修改成功！",
      created: "数据表创建成功！",
      deleted: "数据表删除成功！",
    },
    tableRecord: {
      created: "数据记录创建成功！",
      updated: "数据记录修改成功！",
      deleted: "数据记录删除成功！",
    },
    tableField: {
      created: "字段创建成功！",
      updated: "字段修改成功！",
      deleted: "字段删除成功！",
    },
    tableRelation: {
      created: "成功添加关联模型！",
      updated: "模型关联关系修改成功！",
      deleted: "模型关联关系删除成功！",
    },
    media: {
      uploaded: "文档上传成功！",
      downloaded: "文档下载成功！",
      deleted: "文档删除成功！",
      empty: "暂无关联文档"
    }
  },
  action: {
    add: "添加",
    create: "创建",
    confirm: "确认",
    submit: "提交",
    edit: "编辑",
    rename: "重命名",
    reset: "重置",
    view: "查看",
    close: "关闭",
    cancel: "取消",
    select: "选择",
    publish: "发布",
    withdraw: "撤销发布",
    save: "保存",
    upload: "上传",
    download: "下载",
    import: "导入",
    export: "导出",
    preview: "预览",
    locate: "定位",
    back: "返回",
    signIn: "登录",
    delete: "删除",
    test: "测试",
    manage: "管理",
    configure: "配置参数",
    resetPassword: "重置密码",
    assignPrivilege: "分配角色到账号",
    addGroup: "新建分组",
    addModel: "新建模型",
    downloadTemplate: "下载模板",
    alert: {
      check: "确认",
      sendEmail: "发送邮件",
      sendSMS: "短信通知",
      sendVoice: "语音通知"
    }
  },
  dict: {
    date: {
      ymdh: "yyyy年MM月dd日 h点",
      simple: "yyyy年MM月dd日",
      full: "yyyy年MM月dd日 hh:mm:ss"
    },
    bool: {
      true: "是",
      false: "否"
    },
    status: {
      activated: "激活",
      deactivated: "未激活",
      deleted: "已删除"
    },
    month: {
      jan: "一月",
      feb: "二月",
      mar: "三月",
      apr: "四月",
      may: "五月",
      jun: "六月",
      jul: "七月",
      aug: "八月",
      sep: "九月",
      oct: "十月",
      nov: "十一月",
      dec: "十二月"
    },
    dataType: {
      String: "字符串",
      Text: "长文本",
      Enum: "枚举",
      Integer: "整数",
      Decimal: "小数",
      Date: "日期",
      Time: "时间",
      DateTime: "日期时间",
      Boolean: "布尔值/二值",
      File: "文件",
    },
    time: {
      second: "秒",
      minute: "分",
      hour: "时",
      day: "天",
      week: "周",
      month: "月",
      year: "年"
    },
    pidRuleType: {
      link: "链接",
      control: "控制",
      data: "数据点",
      form: "表单",
      effect: "数据视效"
    },
    alert: {
      status: {
        checked: "已处理",
        active: "待处理"
      }
    },
    ruleChain: {
      group: {
        input: '输入',
        processing: '数据处理',
        condition: '分支条件',
        action: '行为',
        storage: '存储',
        other: '其他'
      },
      widgets: {
        customCondition: {
          label: "自定义",
          description: "通过自定义的函数进行条件判断"
        },
        input: {
          label: "数据输入",
          description: "数据输入"
        },
        readAttributeValue: {
          label: "读取属性值",
          description: "从数据库中读取静态属性值。"
        },
        readSeriesLatestValue: {
          label: "读取最新值",
          description: "从数据库中读取最新的时序点位值。"
        },
        readSeriesHistoryValues: {
          label: "读取历史值",
          description: "从数据库中读取时序点位的历史数值。"
        },
        transform: {
          label: "数据转换",
          description: "提供转换函数，按照需求调整数据结构。"
        },
        threshold: {
          label: "阈值判断",
          description: "判断数值是否满足阈值规则。"
        },
        notifyDevice: {
          label: "通知设备",
          description: "通过MQTT通知设备（多用于告警等）。"
        },
        sendHTTP: {
          label: "发送HTTP请求",
          description: "向第三方服务发送HTTP请求。"
        },
        sendBACNet: {
          label: "发送BACNet指令",
          description: "向BACNet设备发送指令。"
        },
        fireMalfunctionTask: {
          label: "生成故障告警",
          description: "生成故障告警并分配至相关人员及设备设施。"
        },
        firePowerSavingTask: {
          label: "生成节能任务",
          description: "生成节能任务并分配至相关人员及设备设施。"
        },
        sendEmail: {
          label: "发送邮件",
          description: "向指定邮箱发送邮件。"
        },
        sendSMS: {
          label: "发送短信",
          description: "向指定手机号发送短信。"
        },
        sendVoice: {
          label: "语音通知",
          description: "通过电话发送语音通知。"
        },
        timer: {
          label: "定时器",
          description: "在特定时间/以特定周期执行一系列操作。"
        },
        switch: {
          label: "多值条件检测",
          description: "根据多个取值拆分执行路径。"
        },
        heartbeat: {
          label: "心跳检测",
          description: "判断设备在一定时间内是否在线。"
        },
        saveSQL: {
          label: "写入关系型数据库",
          description: "将数据以SQL的方式存储至第三方关系型数据库，如Oracle、MySQL、PostgresQL、SQL Server等。"
        },
        saveRedis: {
          label: "写入Redis",
          description: "将数据写入Redis。"
        },
        readRedis: {
          label: "从Redis读取",
          description: "从Redis中读取数据。"
        }
      }
    }
  },
  map: {
    walk: "步行模式",
    free: "自由模式"
  }
}
