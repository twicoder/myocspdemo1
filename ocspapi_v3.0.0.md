
## 1. 配置管理
### 1.1. 修改配置
### 1.2. 创建配置
### 1.3. 删除配置
## 2. 流任务管理 

### 2.1. 流数据查询（/ocsp/v1/streams/query/） 
	示例：http://127.0.0.1:9527/ocsp/v1/streams/query/?page_size=15&page=1
    请求方式：GET
#### 2.1.1. 请求参数

##### 2.1.1.1. 基本参数

字段|说明|
----------|----------------|
page_size   |	设置查询分页的大小，默认值为15	
page        |设置查询的页码数，默认为1

#### 2.1.2. 返回参数

##### 2.1.2.1. 基本参数

HTTP状态|说明
----------|----|
202  | 查询成功
500  | 服务器内部错误


字段|类型|中文名|备注
----------|----------------|----|--------|
pageSize| int| 页大小|详细见表模型参数
totalPageNumber| int | 总页数
currentPage| int |当前页数
streams|Array| 流数组 |

#### 2.1.3 报文示例
	
##### 2.1.3.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/streams/query/?page_size=15&page=1
```
##### 2.1.3.2 返回报文示例

```
{
    "pageSize": 15,
    "totalPageNumber": 1,
    "currentPage": 1,
    "streams": [
        {
            "streamid": 1,
            "name": "Stream Task",
            "type": 1,
            "receive_interval": 30,
            "queue": "default",
            "status": 0,
            "start_time": null,
            "stop_time": null,
            "description": null,
            "diid": 1,
            "all_fields": [imsi,name,province,lac,cell,a1,a2,product_no],
            "all_eventids": [1,2,3,4]
        },
        {
            "streamid": 2,
            "name": "Stream Task2",
            "type": 1,
            "receive_interval": 30,
            "queue": "default",
            "status": 0,
            "start_time": null,
            "stop_time": null,
            "description": null,
            "diid": 11,
            "all_fields": [imsi,name,province,lac,cell,a1,a2,product_no],
            "all_eventids": [5,6,7,8]
        }
    ]
}
```

### 2.2 根据streamid查询流任务（/ocsp/v1/streams/query/{streamid}/） 
	示例：http://127.0.0.1:9527/ocsp/v1/streams/query/1001/
    请求方式：GET
#### 2.2.1 请求参数

##### 2.2.1.1 基本参数

字段 | 说明
------------|--------
streamid   |	流任务id


#### 2.2.2 返回参数

##### 2.2.2.1 基本参数

HTTP状态|说明
----------|----|
202  | 查询成功
500  | 服务器内部错误


字段|类型|中文名|备注
----------|----------------|----|--------|
streamid| int| 流ID |
name| String | 流名称 |
type| int | 流类型 |
receive_interval| Int | 接受间隔 |
queue| String | 队列模式 |
status| String | 状态 |
start_time|Long| 启动时间 |
stop_time|Long| 停止时间 |
description|String| 说明 |
diid|int| 数据接口ID |
all_fields|Array| 所有字段集合 |
all_eventids|Array| 流关联的事件ID |

#### 2.2.3 报文示例
	
##### 2.2.3.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/streams/query/1001/
```
##### 2.2.3.2 返回报文示例

```
{
    "streamid": 1001,
    "name": "Stream Task2",
    "type": 1,
    "receive_interval": 30,
    "queue": "default",
    "status": 0,
    "start_time": null,
    "stop_time": null,
    "description": null,
    "diid": 11,
    "all_fields": [imsi,name,province,lac,cell,a1,a2,product_no],
    "all_eventids": [5,6,7,8]
}
```

### 2.3 更新流任务
### 2.4 创建流任务
### 2.5 删除流任务

## 3 输入源管理 
### 3.1	根据流任务streamid查询输入源
### 3.2 根据流任务streamid更新输入源
### 3.3 根据流任务streamid创建输入源
### 3.4 根据流任务streamid删除输入源

## 4 事件管理 

### 4.1 查询所有事件（/ocsp/v1/events/query/） 
	示例：http://127.0.0.1:9527/ocsp/v1/events/query/?page_size=15&page=1&startDate=2017-08-24&endDate=2017-09-24&name=test&status=0&badgeNumber=111&source=XXX
    请求方式：GET
#### 4.1.1请求参数

##### 4.1.1.1基本参数

字段|说明|
------------|--------
page_size   |	设置查询分页的大小，默认值为15 (必填)	
page        |   设置查询的页码数，默认为1     (必填)
name        |   事件名称
startDate   |   起始时间
endDate     |   结束时间
status      |   0代表停止事件，1代表启用事件
badgeNumber |   创建工号
source      |   事件来源

#### 4.1.2 返回参数

##### 4.1.2.1基本参数

HTTP状态|说明
----------|----|
200  | 查询成功
500  | 服务器内部错误

字段|类型|中文名|备注
----------|----------------|----|--------|
pageSize| int| 页大小|详细见表模型参数
totalPageNumber| int | 总页数
currentPage| int |当前页数
events|Array| 事件数组

#### 4.1.3 报文示例
	
##### 4.1.3.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/events/query/?page_size=15&page=1&startDate=2017-08-24&endDate=2017-09-24&name=test&status=0&badgeNumber=111&source=XXX
```
##### 4.1.3.2 返回报文示例

```
{
    "pageSize": 15,
    "totalPageNumber": 1,
    "currentPage": 1,
    "events": [
        {
            "eventid": 1,
            "streamid": 1,
            "name": "output1",
            "select_expr": "a1,a2,product_no",
            "filter_expr": "filter",
            "p_event_id": 0,
            "owner": "ocdp",
            "STREAM_EVENT_CEP":{
                "type": 1,
                "code":"ce",
                "identifier":"sd",
                "create_time":"2010-10-30",
                "source": "XXX",
                "badge_number": "111"
            },
            "output": {
                "datainterface_id": 2,
                "datasource_id": 1,
                "topic": "topic1",
                "prefix": "prefix1",
                "interval": 0,
                "delim": ",",
                "subscribe": {
                    "startDate": "2017-08-24",
                    "endDate": "2017-09-24",
                    "period": "week",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1,
            "description": null
        },
        {
            "eventid": 2,
            "streamid": 1,
            "name": "output2",
            "select_expr": "a1,a2,product_no",
            "filter_expr": "filter",
            "p_event_id": 0,
            "STREAM_EVENT_CEP":{
                "type": 1,
                "code":"ce",
                "identifier":"sd",
                "create_time":"2010-10-30",
                "source": "XXX",
                "badge_number": "111"
            },
            "output": {
                "datainterface_id": 3,
                "datasource_id": 1,
                "topic": "topic2",
                "prefix": "prefix1",
                "interval": 0,
                "delim": ",",
                "subscribe": {
                    "startDate": "2017-08-24",
                    "endDate": "2017-09-24",
                    "period": "week",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1,
            "description": null
        },
        {
            "eventid": 3,
            "streamid": 1,
            "name": "output3",
            "select_expr": "a1,a2,product_no",
            "filter_expr": "filter",
            "p_event_id": 0,
            "STREAM_EVENT_CEP":{
                "type": 1,
                "code":"ce",
                "identifier":"sd",
                "create_time":"2010-10-30",
                "source": "XXX",
                "badge_number": "111"
            },
            "output": {
                "datainterface_id": 4,
                "datasource_id": 1,
                "topic": "topic3",
                "prefix": "prefix1",
                "interval": 0,
                "delim": ",",
                "subscribe": {
                    "startDate": "2017-08-24",
                    "endDate": "2017-09-24",
                    "period": "week",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1,
            "description": null
        },
        {
            "eventid": 4,
            "streamid": 1,
            "name": "output4",
            "select_expr": "a1,a2,product_no",
            "filter_expr": "filter",
            "p_event_id": 0,
            "STREAM_EVENT_CEP":{
                "type": 1,
                "code":"ce",
                "identifier":"sd",
                "create_time":"2010-10-30",
                "source": "XXX",
                "badge_number": "111"
            },
            "output": {
                "datainterface_id": 5,
                "datasource_id": 1,
                "topic": "topic4",
                "prefix": "prefix1",
                "interval": 0,
                "delim": ",",
                "subscribe": {
                    "startDate": "2017-08-24",
                    "endDate": "2017-09-24",
                    "period": "week",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1,
            "description": null
        }
    ]
}
```

### 4.2 根据eventid查询流事件（/ocsp/v1/events/query/{eventid}/） 
	示例：http://127.0.0.1:9527/ocsp/v1/events/query/1/
    请求方式：GET
#### 4.2.1 请求参数

##### 4.2.1.1 基本参数

字段 | 说明
------------|--------
eventid   |	事件id

#### 4.2.2 返回参数

##### 4.2.2.1 基本参数

HTTP状态|说明
----------|----|
200  | 查询成功
500  | 服务器内部错误

字段|类型|中文名|备注
----------|----------------|----|--------|
eventid| int| 事件ID |
streamid| int| 流ID |
name| String | 事件名称 |
select_expr| String | 选择表达式 |
filter_expr| String | 过滤表达式 |
p_event_id| int |  |
STREAM_EVENT_CEP | Object | 事件处理中心相关属性 |
output | Object| 输出流相关信息 |
status | int| 事件状态 |
description | String| 说明 |

#### 4.2.3 报文示例
	
##### 4.2.3.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/events/query/1/
```
##### 4.2.3.2 返回报文示例

```
{
  "eventid": 1,
  "streamid": 1,
  "name": "output1",
  "select_expr": "a1,a2,product_no",
  "filter_expr": "filter",
  "p_event_id": 0,
  "STREAM_EVENT_CEP":{
    "type": 1,
    "code":"ce",
    "identifier":"sd",
    "create_time":"2010-10-30",
    "source": "XXX",
    "badge_number": "111"
  },
  "output": {
    "datainterface_id": 2,
    "datasource_id": 1,
    "topic": "topic1",
    "prefix": "prefix1",
    "interval": 0,
    "delim": ",",
    "subscribe": {
      "startDate": "2017-08-24",
      "endDate": "2017-09-24",
      "period": "week",
      "time": [
        {
          "begin": {
            "d": "1",
            "h": "00: 00: 00"
          },
          "end": {
            "d": "2",
            "h": "23: 55: 55"
          }
        }
      ]
    }
  },
  "status": 1,
  "description": null
}
```


### 4.3 创建事件（/ocsp/v1/events/save/）
	示例：http://127.0.0.1:9527/ocsp/v1/events/save/
    请求方式：POST
#### 4.3.1 请求参数

##### 4.3.1.1 基本参数

参数 | 说明
------------|--------
Content-Type|	application/json

字段|类型|中文名|是否必填|备注
----------|----------------|----|--------|------------|
streamid | int | 流ID | 是 |
name | String | 流名称 | 是 |
uniqKeys | String | 唯一主键 | 是 | 必须在select_expr中
props | Array | pname/pvalue | 否 |
select_expr | String | 选择表达式 | 是
filter_expr | String | 过滤表达式 | 是
p_event_id | int |  | 是 |
STREAM_EVENT_CEP | Object | 事件处理中心相关信息 | 是
output | Object | 输出源 | 是 | 输出源相关信息
status | int | 事件状态 | 是 | 
description | String | 说明 | 否

#### 4.3.2 报文示例

##### 4.3.2.1 请求报文示例

```
{
            "streamid": 1, //必填
            "name": "output1", //必填
            "select_expr": "a1,a2,product_no", //必填
            "filter_expr": "filter", //必填
            "p_event_id": 0, //必填
            "props":[
                { "pname":"input1",
                "pvalue":"input2"
                },
                { "pname":"input1",
                "pvalue":"input2"
                }
            ],
            "STREAM_EVENT_CEP":{ //必填
                "type": 1,
                "code":"ce",
                "identifier":"sd",
                "create_time":"2010-10-30",
                "source": "XXX",
                "badge_number": "111"
            },
            "output": { //必填
                "datasource_id": 1,
                "topic": "topic1",
                "prefix": "prefix1",
                "interval": 0,
                "delim": ",",
                "subscribe": { //必填
                    "period": "week",
                    "startDate": "2017-08-24",
                    "endDate": "2017-09-24",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1, //必填
            "description": null
}
```
#### 4.3.3 返回参数

##### 4.3.3.1 基本参数

HTTP状态|说明
----------|----|
201  | 创建成功
500  | 服务器内部错误


字段|类型|备注
----------|----------------|----|
success | boolean | 创建事件是否成功
event | Object | 新创建的事件对象

#### 4.3.4 报文示例

##### 4.3.4.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/events/save/
```
##### 4.3.4.2 返回报文示例

```
{
  success: true,
  event: event
}
```

### 4.4 根据eventid更新事件（/ocsp/v1/events/update/{eventid}/） 
	示例：http://127.0.0.1:9527/ocsp/v1/events/update/1001/
    请求方式：PUT
#### 4.4.1 请求参数

##### 4.4.1.1 基本参数

参数 | 说明
------------|--------
Content-Type|	application/json

字段|类型|中文名|是否必填|备注
----------|----------------|----|--------|------------|
eventid | int | 事件ID | 是 |
streamid | int | 流ID | 是 |
name | String | 流名称 | 是 |
uniqKeys | String | 唯一主键 | 是 | 必须在select_expr中
props | Array | pname/pvalue | 否 |
select_expr | String | 选择表达式 | 是
filter_expr | String | 过滤表达式 | 是
p_event_id | int | ？ | 是 |
STREAM_EVENT_CEP | Object | 事件处理中心相关信息 | 是
output | Object | 输出源 | 是 | 输出源相关信息
status | int | 事件状态 | 是 | 
description | String | 说明 | 否

#### 4.4.2 报文示例

##### 4.4.2.1 请求报文示例

```
{
            "eventid": 1, //必填
            "streamid": 1,
            "name": "output1",
            "select_expr": "a1,a2,product_no",
            "filter_expr": "filter",
            "p_event_id": 0,
            "STREAM_EVENT_CEP":{
                "type": 1,
                "code":"ce",
                "identifier":"sd",
                "create_time":"2010-10-30",
                "source": "XXX",
                "badge_number": "111"
            },
            "output": {
                "datainterface_id": 2,
                "datasource_id": 1,
                "topic": "topic1",
                "prefix": "prefix1",
                "interval": 60,
                "delim": ",",
                "subscribe": {
                    "period": "week",
                    "startDate": "2017-08-24",
                    "endDate": "2017-09-24",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1,
            "description": null
}
```

#### 4.4.2 返回参数

##### 4.4.2.1 基本参数

HTTP状态|说明
----------|----|
202  | 更新成功
500  | 服务器内部错误


字段|类型|备注
----------|----------------|----|
success | boolean | 更新事件是否成功
event | Object | 更新后的事件对象

#### 4.4.3 报文示例

##### 4.4.3.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/events/update/1001/
```
##### 4.4.3.2 返回报文示例

```
{
  success: true,
  event: event
}
```

### 4.5 根据eventid删除事件（不建议使用）（/ocsp/v1/events/delete/{eventid}/） 
	示例：http://127.0.0.1:9527/ocsp/v1/events/delete/1001/
    请求方式：DELETE
#### 4.5.1 请求参数

##### 4.5.1.1基本参数

字段|类型|中文名|是否必填|备注
----------|----------------|----|--------|------------|
eventid | int | 事件ID | 是 |

#### 4.5.2 返回参数

##### 4.5.2.1基本参数

HTTP状态|说明
----------|----|
204  | 删除成功
500  | 服务器内部错误

字段|类型|备注
----------|----------------|----|
success | boolean | 删除事件是否成功

#### 4.5.3 报文示例

##### 4.5.3.1 请求报文示例
```
http://127.0.0.1:9527/ocsp/v1/events/delete/1001/
```
##### 4.5.3.2 返回报文示例

```
{
  success: true
}
```

## 附录
### 1.	字段说明

- 流任务字段说明：
   
```
{
            "streamid": 1,                     //流任务编号
            "name": "Stream Task",             //流任务名称
            "type": 1,                         //流任务所属分类
            "cur_retry": 0,                    //系统内部属性
            "receive_interval": 30,            //系统内部属性
            "num_executors": 10,               //系统内部属性
            "driver_memory": "1g",             //系统内部属性
            "executor_memory": "1g",           //系统内部属性
            "total_executor_cores": 2,         //系统内部属性
            "queue": "default",                //系统内部属性
            "status": 0,                       //流任务状态，0为停止
            "start_time": null,                //流任务启动时间
            "stop_time": null,                 //流任务停止时间
            "description": null,               //流任务描述
            "diid": 1,                         //流任务输入数据源接口编号
            "all_fields": [imsi,name,province,lac,cell,a1,a2,product_no],                    //流任务经过数据增强后形成的所有字段名称
            "all_eventids": [1,2,3,4]          //流任务关联的所有事件编号
}
```
- 事件字段说明：

```
{
            "eventid": 1,                      //事件编号
            "streamid": 1,                     //事件所属流任务编号
            "name": "output1",                 //事件名称
            "select_expr": "a1,a2,product_no", //需要输出的字段，以逗号隔开
            "filter_expr": "filter",           //事件过滤规则
            "p_event_id": 0,                   //事件输出顺序，现事件并行输出，填0
            "output": {
                "datainterface_id": 2,         //事件输出接口编码
                "datasource_id": 1,            //事件输出方式，1为kafka
                "topic": "topic1",             //当事件输出方式为1，该项为kafka topic 名称
                "prefix": "prefix1",           //当事件输出方式为2，该项为codis前缀
                "interval": 60,                //事件营销周期，单位为秒，在该期间一个key符合条件的信息只输出一次
                "delim": ",",                  //事件输出字段分隔符
                "subscribe": {                 //事件订阅时间，详见附录2
                    "period": "week",
                    "time": [
                        {
                            "begin": {
                                "d": "1",
                                "h": "00: 00: 00"
                            },
                            "end": {
                                "d": "2",
                                "h": "23: 55: 55"
                            }
                        }
                    ]
                }
            },
            "status": 1,                        //事件状态，1为启用，0为禁用
            "description": null                 //事件详细描述
        }
```
### 2.	事件订阅时间配置
- 随机时间段

```
{
    "period": "none",
    "time": [
        {
            "begin": {
                "d": "2016-09-12",
                "h": "00:00:00"
            },
            "end": {
                "d": "2016-09-12",
                "h": "23:55:55"
            }
        }
    ]
}
```
- 按天为时间周期

```
{
    "period": "day",
    "time": [
        {
            "begin": {
                "d": "0",
                "h": "00:00:00"
            },
            "end": {
                "d": "0",
                "h": "23:55:55"
            }
        }
    ]
}
```
- 按周为时间周期(d这个值从周日(1)开始)

```
{
    "period": "week",
    "time": [
        {
            "begin": {
                "d": "1",
                "h": "00:00:00"
            },
            "end": {
                "d": "2",
                "h": "23:55:55"
            }
        }
    ]
}
```
- 按月为时间周期

```
{
    "period": "month",
    "time": [
        {
            "begin": {
                "d": "01",
                "h": "00:00:00"
            },
            "end": {
                "d": "02",
                "h": "23:55:55"
            }
        },
        {
            "begin": {
                "d": "29",
                "h": "00:00:00"
            },
            "end": {
                "d": "30",
                "h": "23:55:55"
            }
        }
    ]
}
```