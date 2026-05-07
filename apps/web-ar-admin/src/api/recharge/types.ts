/**
 * @description: 0 - 成功 1 - 失败 2 - 验证码失败 3 - 短信验证码错误 4 - Token失效或没登录 5 - 签名错误 7 - 参数不合法 9 - 用户验证错误 10 - 三方游戏出错 11 - 访问错误 13 - 网络异常 14 - 没有操作权限 -2 - 其他错误 -1 - 代码异常
 */
export type ApiCodeEnum = 0 | 1 | 2 | 3 | 4 | 5 | 7 | 9 | 10 | 11 | 13 | 14 | -2 | -1;

/**
 * @description: 0 - Succeed 1 - Failed 2 - No operation permission 3 - Wrong signature 4 - Timestamp has expired 5 - Url is not exist 6 - Param is Invalid 7 - Order does not exist 8 - The order has been processed 9 - Do not resubmit 11 - Wrong request 12 - Method not allowed 13 - Too frequent access, please try again later 14 - ID not exists 15 - Conditions are not met 19 - Order failed 20 - Please upload a properly formatted image 21 - Alibaba Cloud OSS file server error 23 - Network timeout 24 - Please upload video files in the correct format 25 - Server is busy, please try again later 26 - The operation is being processed, please try again later 27 - Request IP is not in the whitelist 110 - Invitor Not Existed 112 - Phone number is wrong 176 - Register type is wrong 179 - The mobile phone number is bound and cannot be registered 180 - The email is bound and cannot be registered 181 - Database exception 182 - There is no data available for export at the moment 189 - Email format is incorrect 190 - Custom path is invalid 191 - Upload to R2 server error 192 - File name cannot contain Chinese characters 999 - 系统管理_公共模块_占位 1000 - Sms Id already exists 1001 - IP already exists 1002 - CF operation failed 1003 - You need to use the master control account to call this method 1004 - Please select the file to be uploaded 1005 - Please upload the specified template file as required 1006 - Wrong content of uploaded file 1007 - The single data limit cannot exceed 15,000 items 1008 - File does not exist 1009 - No upload content available or upload file information already exists 1010 - Non-merchants cannot operate 1011 - The category cannot be deleted because there are associated image resources under the category 1012 - The resource key already exists 1013 - The style code does not exist 1014 - The color code does not exist 1015 - The page code does not exist 1016 - The image address cannot be empty 1017 - The image specification cannot be empty 1018 - The category cannot be deleted because there are associated merchant styles under the category 1019 - Merchant resources do not exist 1037 - Please select a merchant 1038 - Only merchants can operate 1100 - 系统后台_占位 1101 - Duplicate permission unique identification code 1102 - Menu does not exist 1103 - The menu button does not exist 1104 - System user does not exist 1105 - System user already exists 1106 - Please select the user to reset 1107 - System user nickname already exists 1108 - System user account cannot be modified 1109 - Role does not exist 1110 - Role already exists 1111 - Duplicate character name 1112 - Please select the role to delete 1113 - Please select the role to query 1114 - Role permission information cannot be empty 1115 - Tenant does not exist 1116 - Tenant permission information cannot be empty 1117 - Record doesn't exist 1118 - Only give organization administrators editing permissions 1119 - vCode isn't correct 1120 - Backend account not exists 1121 - Backend account has been forbidden 1122 - The account has been locked. Continuous password input has reached the limit. Contact customer service to release the lock 1123 - Password does not correct 1124 - Login out 1125 - Access is not authorized, please contact the administrator 1126 - Your account is already logged in elsewhere 1127 - Login has expired 1128 - Need bind GoogleCode 1129 - No need bind GoogleCode 1130 - Parent menu does not exist 1131 - The passwords entered twice are inconsistent 1132 - The data already exists 1133 - This sort already exists 1134 - The data does not exist 1135 - The current merchant has data in application 1136 - The current data status is incorrect 1139 - This data has been used 1140 - Only closed data can be deleted 1141 - The organization is not enabled 1142 - Cannot operate on your own account 1143 - System user info cannot be empty 1144 - Public config cannot be empty 1145 - System user info is invalid 1146 - System user account cannot be empty 1147 - System user name cannot be empty 1148 - System user password cannot be empty 1149 - Role permission info is invalid 1150 - Organization info is invalid 1151 - System user state info is invalid 1152 - Google verify info is invalid 1153 - Manage tenant info is invalid 1154 - Withdraw config group info is invalid 1155 - System user rank info is invalid 1156 - Parent system user info is invalid 1157 - Withdraw tenant info is invalid 1158 - Withdraw permission config is invalid 1159 - Approval user role info is invalid 1160 - Approval switch info is invalid 1161 - Approval user state info is invalid 1162 - Approval role authorize info cannot be empty 1163 - Approval role authorize info is invalid 1164 - Approval sub role authorize info cannot be empty 1165 - Approval sub role authorize info is invalid 1166 - Approval tenant info is invalid 1167 - Approval permission config is invalid 1168 - Withdraw config and approval config cannot both be empty 1169 - Withdraw state info is invalid 1170 - System user state type info is invalid 1171 - Please select the system user to operate 1172 - Failed to save withdraw config group translations 1173 - Withdraw config group translation language code cannot be empty 1174 - Withdraw config group info cannot be empty 1175 - Parent system user info cannot be empty 1176 - Withdraw currency type info is invalid 1177 - Withdraw audit amount range info is invalid 1178 - Current processing order limit info is invalid 1179 - System user withdraw permission is not configured 1180 - Coverage rule info is invalid 1181 - The system user's managed tenants exceed the current account's manageable range 1182 - The added user collection cannot contain duplicate usernames 1183 - The user has bound subordinates and the position cannot be changed 1184 - The user is working and the withdraw state cannot be changed 1185 - The user is working and the position cannot be changed 1186 - Parent system user id config is invalid 1187 - Parent system user does not exist or is not in the current organization 1188 - The staff's parent system user must be leader 1189 - The leader's parent system user must be manager 1190 - The user is working and withdraw permission config cannot be changed 1999 - 会员_代理_报表相关_占位符 2000 - Member group name already exists 2001 - When exporting, you need to specify the export field list 2002 - Account has been registered 2003 - The password format is incorrect and must be a combination of letters and numbers and must be between 8 and 15 characters in length. 2004 - The account mobile number format is incorrect 2005 - The account email format is incorrect
 2006 - Member does not exist 2007 - Group does not exist 2008 - Tag does not exist 2009 - Chat room permissions cannot be empty 2010 - Bank card format is incorrect 2011 - The bank card has been bound 2012 - The account format is incorrect 2013 - The account has been bound 2014 - Address format is incorrect 2015 - The address has been bound 2016 - UPI format is incorrect 2017 - Bank card does not exist 2018 - UPI has been bound 2019 - The sum of rates exceeds limitation 2020 - Name format is incorrect 2021 - Tag name already exists 2022 - Tags in use cannot be deleted 2023 - Group name already exists 2024 - The maximum VIP level is incorrectly set 2025 - bank does not exist 2026 - Wallet type does not exist 2027 - The virtual currency type does not exist 2028 - The virtual currency network does not exist 2029 - Need to enter UserId 2030 - Member or inviter does not exist 2031 - The user already exists under the invitee 2032 - The number of subordinate users of the invitee has exceeded the upper limit 2033 - The current member is already level 0 2034 - The parameters do not meet the conditions 2035 - Matryoshka dolls are generated when binding invitations 2036 - Please unbind the member first 2037 - Failed to obtain IP address 2038 - Channel does not exist 2039 - Mobile registration is not available 2040 - Email registration is not available 2041 - Invitation code cannot be empty 2042 - Verification code cannot be empty 2043 - The invitation code has expired 2044 - Registration failed 2045 - Account has been registered 2046 - Channel code does not exist 2047 - The newly registered user does not exist 2048 - Two passwords are inconsistent 2049 - VipLevel does not exists or has been disalbed 2050 - Member status unavailable 2051 - Duplicate data 2052 - The return commission level is incorrect 2053 - The return commission level cannot be empty 2054 - CPF and PIX account contents are inconsistent 2055 - The calculation of the bet amount cannot be less than 1 2056 - Recharge level does not exist or has been disabled 2057 - The current agent line is being unbind. 2057 - The current agent line is being unbind. 2058 - Member information cannot be empty 2059 - The number of data cannot exceed 500 at a time 2060 - No valid member data 2061 - The tourist account does not allow modification 2062 - The export task has been created, please download from the export task list later. 2063 - The submitted data contains conflicts between vendors or gamecodes. Please check.. 2101 - Tag name cannot be empty 2102 - The minimum condition cannot be greater than the maximum condition 2103 - Tag name already exists 2104 - Condition group cannot be empty 2105 - Basic tag does not exist 2106 - Tag has been disabled 2999 - 财务相关_占位符 3000 - Duplicate bank name 3001 - Duplicate bank code 3002 - Currency cannot be empty 3003 - Currency does not exist 3004 - Recharge type does not exist 3005 - The recharge channel does not exist 3006 - The recharge channel dictionary does not exist 3007 - Bank dictionary does not exist 3008 - The withdrawal channel does not exist 3009 - Category does not exist 3010 - Quantity limit exceeded during import 3011 - Data duplication 3012 - The third-party mapping code does not exist 3013 - Gateway address does not exist 3014 - The third-party gateway address already exists 3015 - Merchant currency information does not match 3016 - The maximum amount must be greater than the minimum amount 3017 - Channel ID already exists 3018 - The gateway address already exists 3019 - name already exists 3020 - WithdrawType does not exist 3021 - wrong datetime format 3022 - Recharge Level does not exist 3023 - Amount cannot large then order amount 3024 - Bonus cannot be 0 3025 - The Bonus cannot be greater than 0 3026 - Amount cannot be 0 3027 - The amount cannot be greater than 0 3028 - Remark cannot be empty 3029 - Manual recharge type cannot be empty 3030 - Business information does not exist 3030 - Business information does not exist 3031 - The number of recharge levels exceeds the limit
 3032 - The order has been locked by other 3033 - No validate data need to process 3034 - WithdrawType already exists 3035 - Incorrect USDT address type 3036 - The manual deposit amount cannot be equal to the member ID 3037 - The withdraw channel was disabled 3038 - The withdraw channel secret information not exists 3039 - The quick recharge amount cannot be 0 3040 - Three-party banks already exist 3041 - Please bind identity information 3042 - This usdt network type is currently not supported 3043 - Create recharge order failed 3044 - The recharge amount is not up to the standard 3045 - The withdraw type error 3046 - The robot configuration does not exist 3047 - The current recharge level has a higher level 3048 - Order is already locked by another user 3049 - The withdraw channel does not support this category 3049 - The withdraw channel does not support this category 3050 - The bank account number cannot be empty 3051 - The wallet address cannot be empty 3052 - The BettingMultiplier must be a positive integer 3053 - No valid import data found 3054 - Order amount should be hundreds 3055 - Recharge channel is not correct 3056 - The recharge amount does not meet the requirements 3057 - Ongoing order not completed 3058 - Order match failed, Place order timeout, try another order amount. 3059 - You have been banned from recharging due to frequent cancellations 3060 - You have been banned from recharging due to abnormal recharge behavior 3061 - UTR Repeat 3062 - Exceed submit times 3063 - Actual amount is less than KYC amount. 3064 - Your top-up function has been disabled by the channel, please contact our customer service. 3065 - Local recharge orders must submit proof before manual completion. 3066 - The current merchant currency does not support this recharge category. 3067 - Built-in channel cannot be deleted. 3068 - Built-in channel key fields cannot be modified. 3069 - Key fields cannot be modified. 3070 - Built-in channel cannot be edited. 3071 - The third-party merchant has been disabled, and the channel has been synchronously disabled by the system. Operation is not allowed. 3072 - ChannelIds can not be empty. 3073 - ChannelType must be 'Recharge' or 'Withdraw'. 3074 - ChannelIds format error. 3075 - Some ChannelId not found in channel dictionary. 3076 - Some ThirdPayMerchantId not found. 3077 - Some data already exists in  V1, please check. 3078 - ThirdCurrency has reached the upper limit. 3079 - At least one of MerchantCode, MerchantKey, PublicKey, PrivateKey is required. 3080 - Audit record API is not implemented yet. 3081 - Third-party record API is not implemented yet. 3082 - Start time is required. 3083 - Start date format is invalid. 3084 - End date format is invalid. 3085 - Start time cannot be more than 65 days ago. 3086 - The time span between start and end cannot exceed 35 days. 3087 - Report date format is invalid. 3088 - Start work time format is invalid. 3089 - End work time format is invalid. 3090 - Start work time cannot be earlier than the report date. 3091 - End work time must be later than start work time. 3092 - Work duration cannot be less than 1 hour. 3093 - Work duration cannot exceed 24 hours. 3094 - No work record was found for the specified date. 3095 - The work record for this date cannot be corrected because start or end time is missing. 3096 - Start work time cannot be earlier than the previous shift end time. 3097 - End work time cannot be later than the next shift start time. 3098 - The group already has bound users and cannot be deleted. 3099 - The user has not enabled the withdrawal function. 3100 - Current status does not allow clock in, please contact your supervisor. 3101 - The user is currently not at work. 3102 - Current status is abnormal, please contact your supervisor. 3103 - User work start time record is abnormal. 3104 - Current status does not allow clock out, please contact your supervisor. 3105 - Order taking has been suspended by your supervisor. 3106 - Already in order taking status. 3107 - No clock in record found. 3108 - Already in paused status. 3109 - Current status does not allow recovery. 3110 - Current work status does not allow order audit. 3111 - Cannot audit orders locked by others. 3112 - The order audit has already started, do not repeat the operation. 3113 - Cannot assign orders to yourself. 3114 - The target user's rank does not allow order acceptance. 3115 - The target user's current status does not allow order assignment. 3116 - Some orders are not locked by the current user. 3117 - Current rank does not allow this operation. 3118 - Cannot operate orders locked by others. 3119 - The same  display name already exists in the current merchant. 3120 - The channel must be disabled before deletion. 3121 - The order has been submitted to the third party and is being processed. 3122 - The withdrawal order has been updated, please refresh and try again. 3123 - The withdrawal channel has been closed. 3124 - Tenant channel configuration not found or unavailable. 3125 - Failed to update the order to submitting to third party. 3126 - Third-party interface call exception or timeout. 3127 - The order is not locked. 3128 - Test accounts are not allowed to withdraw. 3129 - Current order status does not allow reaudit. 3130 - Current third-party status does not allow exception clearing. 3131 - Operation too frequent, please try again later. 3132 - Third-party merchant key content is too long. 3133 - Third-party merchant public key content is too long. 3134 - Third-party merchant private key content is too long. 3135 - Withdrawal amount does not meet the requirements. 3136 - Test user does not exist. 3137 - Failed to create test withdraw order. 3138 - Failed to call PayApi. 3139 - UPI category cannot be set to require verification. 3140 - The selected built-in category cannot be set to require verification. 3141 - Withdrawal order number cannot be empty. 3142 - Order number cannot be empty. 3143 - Minimum withdrawal amount cannot be greater than maximum withdrawal amount. 3144 - The user is outside your management scope. 3145 - The current user has not been stopped from taking orders, no need to resume dispatch. 3146 - No clock-in record was found for this user, unable to resume dispatch. Please contact the administrator. 3147 - The current user is not at work, no need to stop dispatch. 3148 - The current user has already been stopped from dispatch, no need to repeat the operation. 3149 - The current user has paused order taking, unable to stop dispatch. 3150 - The current user status is abnormal, please clear the abnormal status first. 3151 - No clock-in record was found for this user, unable to stop dispatch. Please contact the administrator. 3152 - The current user status is not abnormal, no need to clear exception. 3153 - No exception operation record was found for this user, unable to clear exception. Please contact the administrator. 3154 - Channel dictionary has been disabled. 3155 - Order amount is not within the channel's allowed range. 3156 - Current time is not within the channel's allowed time window. 3157 - Current channel only supports withdrawals in multiples of 100. 3158 - Orders being transferred in bulk must share the same currency. 3159 - Orders being transferred in bulk must share the same withdraw category. 3160 - Target user's withdrawal currency does not match the order. 3161 - Target user's tenant scope does not cover the order's tenant. 3162 - Insufficient columns. ChannelId, BankName, and ThirdCode are required. 3163 - ChannelId format is invalid. 3164 - BankName cannot be empty. 3165 - ThirdCode cannot be empty. 3166 - The channel id does not exist and has been skipped. 3167 - The bank mapping already exists and has been skipped. 3168 - The bank mapping under this channel already has historical records and cannot be added repeatedly. 3169 - The bank mapping under this channel already exists. Do not add it again. 3300 - The interval between the start time and the previous shift start time cannot be less than 24 hours. 3301 - The interval between the start time and the next shift start time cannot be less than 24 hours. 4000 - Third Game Not Exist 4001 - Third Game vendor Not Exist 4002 - Hotgame is closed 4003 - The test account cannot be accessed 4004 - The vendor config Not Exist 4005 - The vendor is closed 4006 - Gameid can't be empty 4007 - The sub-game is closed 4008 - The sub-game is not exist 4009 - Request parameters cannot be empty 4010 - User ID cannot be empty 4011 - Non-repeatable submission 4012 - Requests are too frequent, Please try again later 4013 - Program exception 4014 - Internal system exception 4015 - The interval for recovery balance requests is 30 seconds. Please try again later 4016 - The interval for querying balance requests is 5 seconds. Please try again later 4017 - VendorCode is wrong 4018 - VendorCode not exist 4019 - The verification game failed 4020 - withdraw failed, exit directly 4021 - The status of the recovered balance is unknown, please try to recover manually 4022 - Game code cannot be empty 4023 - Failed to get third-party game token 4024 - Third-party account creation Failed 4025 - Failed to get third-party login address 4026 - The transfer failed to recharge, and the user balance was rolled back 4027 - Game code does not exist 4028 - No matching game channel  4029 - Game channel not configured 4030 - Game channel is closed 4031 - Game channel is under maintenance 4032 - The vendor does not support this currency 4033 - The Merchant has been disabled 4034 - The Agent has been disabled 4035 - The Agent does not exist 4036 - The Merchant does not support this game vendor 4037 - This game vendor of the merchant has been closed 4038 - The game vendor of this merchant is under maintenance 4039 - The sub-game is under maintenance 4040 - This sub-game does not support this currency 4041 - The end time cannot be earlier than the start time. 4042 - The vendor is closed 4043 - The vendor is maintaining 4044 - The system is under maintenance, please try again later 4999 - 自营游戏_彩票相关__占位符 5999 - 活动相关__占位符 6000 - 中奖率总和不能超过100 6001 - 大转盘奖品数量超出限制 6002 - Data does not exist 6003 - Activity status is incorrect 6004 - The maximum timeout period for the super prize cannot exceed 30 days 6005 - Only events that have not started can be modified 6006 - The activity has been started and cannot be modified 6007 - Code washing configuration is empty 6008 - No members need to wash code 6009 - The gift code prefix cannot be empty 6010 - The fixed amount cannot be empty 6011 - The minimum and maximum amount of random amount cannot be empty 6012 - The current gift code already exists 6013 - The unique gift code cannot be empty 6014 - The expiration time must be greater than the current time 6015 - The current batch status does not allow operation 6016 - The cycle time cannot be less than 0 6017 - The total prize amount cannot be less than 0 6018 - The first rotation bonus ratio cannot be less than 0 6019 - The daily free draw count cannot be less than 0 6020 - The free draw amount range cannot be less than 0 6021 - The invitation draw count cannot be less than 0 6022 - The invitation winning ratio cannot be less than 0 6023 - The random amount of non-winning cannot be less than 0 6024 - The current activity information already exists 6025 - The vendor already has a global vendor activity, sub-game activities cannot be added. 6026 - The vendor already has a sub-game activity, and a global vendor activity cannot be added. 6027 - The end time must be greater than the start time 6028 - The loop recharge type can no more than one. 6029 - The cycle time cannot be more than 365 6030 - Please setting cycle time first 6031 - The value of SpecialWheelUnlockCond must more than 0 6032 - The value of total Weight must more than 0 6033 - There are unfinished packages 6034 - There are unfinished tasks 6035 - The tournament has not been enabled 6036 - There are no ongoing activities 6037 - The data of the previous prize pool is not allowed to be modified 6038 - The user ranking list rewards are automatically being reviewed and approved 6039 - The agent ranking list rewards are automatically being reviewed and approved 6040 - Priority cannot be duplicated 6041 - The prize pool amount cannot be less than zero 6042 - The issue no does not exist 6043 - The target amount can not less or equeal than current amount 6044 - The user has target amount config record 6045 - Can not greater than current issus's end date. 6046 - The member has been prohibited from receiving activity rewards 6047 - Start time cannot be less than the current time. 6048 - PreheatTime must greater than CountdownTime. 6049 - FixedRounds cant not empty. 6050 - FixedRound time must be greater than 0 6051 - FixedRound time must be incremental 6052 - FixedRound time must be between activity start and end time 6053 - CycleRound config cannot be empty 6054 - Only one RewardConfigDetail with all VipLevel can be configured 6055 - Duplicate VipLevel in RewardConfigDetail 6056 - Activity period has overlap 6057 - There are ongoing or completed rounds 6058 - Activity cannot be modified during running 6059 - Activity cannot be delete during running 6060 - Activity is ended 6061 - IntervalTime is invalid 6062 - Activity is ongoing or closed, duplicate openings are prohibited 6063 - The same type of activity has been opened, and duplicate openings are prohibited 6064 - Activity is ongoing or editing is prohibited 6065 - Can only open or void the lucky doubling activity 6066 - Activity is not opened, closed or voided, operation is prohibited 6067 - Activity is opened, closed or voided, operation is prohibited 6068 - Activity gift recipients are still being imported 6069 - Activity gift recipients import failed 6070 - Partial activity import failed 6072 - Only failed imports can be retried 6083 - No valid user ID included 6084 - Target audience information is not set 6085 - Condition reward details are not set 6086 - No users found that meet the criteria 6095 - Ended activities cannot change status 6096 - The activity end time must be greater than the start time 6097 - Cannot change activity status to not started 6098 - Activities that have not started cannot be ended directly 6099 - Only activities that have not started can be opened 6100 - Only ongoing activities can be ended 6101 - Abnormal activity status 6102 - The source activity configuration does not exist 6103 - There are activities where all members cannot start other activities 6104 - There are other activities that cannot start all member activities 6105 - There is an intersection of VIP levels that cannot be opened 6106 - There is an intersection of target users that cannot be opened 6107 - Ongoing activities cannot be re-enabled 6108 - The activity cycle has ended and the activity cannot be enabled 6109 - Ongoing activities cannot be edited 6110 - The activity start time cannot be less than today 6111 - The number of days for custom periodic sign-in activities cannot be zero 6112 - System activity information cannot be deleted 6113 - System activity information cannot be added 6999 - 聊天室相关__占位符 7000 - Chat room interface information is not configured 7001 - Chat room creation failed 7002 - Chat room does not exist 7003 - Chat room has been closed 7004 - Failed to modify chat room ban status 7005 - Chat room user creation failed 7006 - Chat room already exists 7999 - 商户相关__占位符 8000 - Tenant not exists 8001 - Tenant name already exists 8002 - Not a Tennat role 8003 - Basic data does not exist 8004 - The merchant administrator does not exist 8005 - Merchant administrator password reset failed 8006 - The account cannot exist in Chinese 8007 - The tenant db does not exist 8008 - The adb does not exist 8009 - The merchant ID already exists 8010 - The merchant ID cannot be empty 8011 - Tenant id not match with domain url 8012 - Please set the initial value of the pool first. 8012 - Please set the initial value of the pool first. 8013 - The operation parameter specified merchant is not supported 8013 - The operation parameter specified merchant is not supported 8014 - Organization not exists 8015 - Organization name already exists 8016 - Cannot delete organization with tenants 8017 - All selected tenants must share the same currency. 9000 - Title already exists 9001 - Channel name already exists 9002 - The web domain already exists 9003 - Merchant language does not exist 9004 - Email encoding is incorrect 9005 - SMS encoding is incorrect 9006 - The admin domain already exists 9007 - Only one SMS template can be configured for the same supplier and the same language 9008 - Only one email template can be configured for the same supplier mailbox and the same language 9009 - Email service provider already exists 9010 - Verification failed 9011 - User ID verification failed, multiple member ID line number separated 9012 - The maximum number of member IDs for the grand prize supplement cannot exceed 100 9013 - 暂无配置自动发送消息模版 9014 - Only unsent messages can be operated 9015 - Project does not exist 9016 - Only one project configuration can be enabled 9017 - Only unsent messages can be deleted 9018 - The ws publish domain is null 9019 - The member already exists in the blacklist 9020 - The phone number already exists in the blacklist 9021 - The device number already exists in the blacklist 9022 - The withdrawal account already exists in the blacklist 9023 - No valid IP address 9024 - Cannot modify an ended maintenance record 9025 - Please go to domain management to add the traffic promotion domain 9026 - The current status does not allow this operation 9027 - An internal message that has not been sent does not need to be withdrawn 9028 - The internal message has been withdrawn 9029 - PWA type domain names do not support manual operations 9030 - Apk name can not be empty 10000 - The parameter 'CustomParams' can not be empty. 10001 - The parameter 'ServiceParams' can not be empty. 10002 - The parameter 'CustomParams' and 'ServiceParams' can not be empty. 10061 - Third system fail. 10062 - Activity blacklist type not exist. 11000 - duplicate payment channels. 11001 - The data has done. 11002 - unique key already exists. 11003 - This data is in use and cannot be deleted at the moment. 11004 - This data is in use and cannot be deleted at the moment. 11005 - Tenant code already exists 11006 - The number of incorrect verification codes has reached the upper limit 11007 - WorkOrder type does not exist 11008 - Attachment type does not exist 11009 - Session expired 11010 - Verification code has expired 11011 - WorkOrder must upload attachments 11012 - UTR field cannot be empty 11013 - Tenant unavailable 11014 - Wrong sign 11015 - Request Timeout 11016 - WorkOrder Type Does Not Match 11017 - Unsupported WorkOrder Type 11018 - WorkOrder Type Limit Reached 11019 - No Permission Operate 11020 - Username Already Exists 11021 - UserType field be required 11022 - Form does not match 11023 - Image server not configured 11024 - Verification Code sending failed 11025 - Verification code cannot be empty 11026 - Incorrect verification code 11027 - Verification code has expired 11028 - NewPassword cannot be empty 11029 - Language not supported. 11030 - Contain at least one required field. 11031 - Unsupported WorkOrder Status 11032 - Not Found Data 11033 - Work Order does not exist 11034 - Work Order has been processed 11035 - Reminder too frequent, Please try again later. 11036 - Recharge Order not available. 11037 - File type not supported. 11038 - File name format does not match. 11039 - Import document parameter verification failed. 11040 - Importing data failed. 11041 - Failed to read document. 11042 - Failed to request UserName list. 11043 - Failed to sync redis cache. 11044 - FAQ Module is not supported. 11045 - The same type of work order is in progress, please do not submit it repeatedly. 11046 - The query result exceeds the 2000 records limit. 11047 - Keyword already exists. 11048 - The requested data exceeds the upper limit. 11049 - The current state does not support this operation. 11050 - This form is currently disabled. 11051 - You have already bound the USDT-wallet, please contact customer service to modify 11052 - The requested form could not be found. 11053 - The specified query time exceeds the allowed range. 11054 - The compensation rule with the same amount already exists. 11055 - Estimated time for withdrawal arrival is not configured. 11056 - The compensation rule timeout in hours must be greater than or equal to the estimated withdrawal arrival time. 11057 - The window minutes for failure rate warning must be between 10 and 1440. -1 - None
 */
export type ApiMessageEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 12 | 13 | 14 | 15 | 19 | 20 | 21 | 23 | 24 | 25 | 26 | 27 | 110 | 112 | 176 | 179 | 180 | 181 | 182 | 189 | 190 | 191 | 192 | 999 | 1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008 | 1009 | 1010 | 1011 | 1012 | 1013 | 1014 | 1015 | 1016 | 1017 | 1018 | 1019 | 1037 | 1038 | 1100 | 1101 | 1102 | 1103 | 1104 | 1105 | 1106 | 1107 | 1108 | 1109 | 1110 | 1111 | 1112 | 1113 | 1114 | 1115 | 1116 | 1117 | 1118 | 1119 | 1120 | 1121 | 1122 | 1123 | 1124 | 1125 | 1126 | 1127 | 1128 | 1129 | 1130 | 1131 | 1132 | 1133 | 1134 | 1135 | 1136 | 1139 | 1140 | 1141 | 1142 | 1143 | 1144 | 1145 | 1146 | 1147 | 1148 | 1149 | 1150 | 1151 | 1152 | 1153 | 1154 | 1155 | 1156 | 1157 | 1158 | 1159 | 1160 | 1161 | 1162 | 1163 | 1164 | 1165 | 1166 | 1167 | 1168 | 1169 | 1170 | 1171 | 1172 | 1173 | 1174 | 1175 | 1176 | 1177 | 1178 | 1179 | 1180 | 1181 | 1182 | 1183 | 1184 | 1185 | 1186 | 1187 | 1188 | 1189 | 1190 | 1999 | 2000 | 2001 | 2002 | 2003 | 2004 | 2005 | 2006 | 2007 | 2008 | 2009 | 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 | 2032 | 2033 | 2034 | 2035 | 2036 | 2037 | 2038 | 2039 | 2040 | 2041 | 2042 | 2043 | 2044 | 2045 | 2046 | 2047 | 2048 | 2049 | 2050 | 2051 | 2052 | 2053 | 2054 | 2055 | 2056 | 2057 | 2057 | 2058 | 2059 | 2060 | 2061 | 2062 | 2063 | 2101 | 2102 | 2103 | 2104 | 2105 | 2106 | 2999 | 3000 | 3001 | 3002 | 3003 | 3004 | 3005 | 3006 | 3007 | 3008 | 3009 | 3010 | 3011 | 3012 | 3013 | 3014 | 3015 | 3016 | 3017 | 3018 | 3019 | 3020 | 3021 | 3022 | 3023 | 3024 | 3025 | 3026 | 3027 | 3028 | 3029 | 3030 | 3030 | 3031 | 3032 | 3033 | 3034 | 3035 | 3036 | 3037 | 3038 | 3039 | 3040 | 3041 | 3042 | 3043 | 3044 | 3045 | 3046 | 3047 | 3048 | 3049 | 3049 | 3050 | 3051 | 3052 | 3053 | 3054 | 3055 | 3056 | 3057 | 3058 | 3059 | 3060 | 3061 | 3062 | 3063 | 3064 | 3065 | 3066 | 3067 | 3068 | 3069 | 3070 | 3071 | 3072 | 3073 | 3074 | 3075 | 3076 | 3077 | 3078 | 3079 | 3080 | 3081 | 3082 | 3083 | 3084 | 3085 | 3086 | 3087 | 3088 | 3089 | 3090 | 3091 | 3092 | 3093 | 3094 | 3095 | 3096 | 3097 | 3098 | 3099 | 3100 | 3101 | 3102 | 3103 | 3104 | 3105 | 3106 | 3107 | 3108 | 3109 | 3110 | 3111 | 3112 | 3113 | 3114 | 3115 | 3116 | 3117 | 3118 | 3119 | 3120 | 3121 | 3122 | 3123 | 3124 | 3125 | 3126 | 3127 | 3128 | 3129 | 3130 | 3131 | 3132 | 3133 | 3134 | 3135 | 3136 | 3137 | 3138 | 3139 | 3140 | 3141 | 3142 | 3143 | 3144 | 3145 | 3146 | 3147 | 3148 | 3149 | 3150 | 3151 | 3152 | 3153 | 3154 | 3155 | 3156 | 3157 | 3158 | 3159 | 3160 | 3161 | 3162 | 3163 | 3164 | 3165 | 3166 | 3167 | 3168 | 3169 | 3300 | 3301 | 4000 | 4001 | 4002 | 4003 | 4004 | 4005 | 4006 | 4007 | 4008 | 4009 | 4010 | 4011 | 4012 | 4013 | 4014 | 4015 | 4016 | 4017 | 4018 | 4019 | 4020 | 4021 | 4022 | 4023 | 4024 | 4025 | 4026 | 4027 | 4028 | 4029 | 4030 | 4031 | 4032 | 4033 | 4034 | 4035 | 4036 | 4037 | 4038 | 4039 | 4040 | 4041 | 4042 | 4043 | 4044 | 4999 | 5999 | 6000 | 6001 | 6002 | 6003 | 6004 | 6005 | 6006 | 6007 | 6008 | 6009 | 6010 | 6011 | 6012 | 6013 | 6014 | 6015 | 6016 | 6017 | 6018 | 6019 | 6020 | 6021 | 6022 | 6023 | 6024 | 6025 | 6026 | 6027 | 6028 | 6029 | 6030 | 6031 | 6032 | 6033 | 6034 | 6035 | 6036 | 6037 | 6038 | 6039 | 6040 | 6041 | 6042 | 6043 | 6044 | 6045 | 6046 | 6047 | 6048 | 6049 | 6050 | 6051 | 6052 | 6053 | 6054 | 6055 | 6056 | 6057 | 6058 | 6059 | 6060 | 6061 | 6062 | 6063 | 6064 | 6065 | 6066 | 6067 | 6068 | 6069 | 6070 | 6072 | 6083 | 6084 | 6085 | 6086 | 6095 | 6096 | 6097 | 6098 | 6099 | 6100 | 6101 | 6102 | 6103 | 6104 | 6105 | 6106 | 6107 | 6108 | 6109 | 6110 | 6111 | 6112 | 6113 | 6999 | 7000 | 7001 | 7002 | 7003 | 7004 | 7005 | 7006 | 7999 | 8000 | 8001 | 8002 | 8003 | 8004 | 8005 | 8006 | 8007 | 8008 | 8009 | 8010 | 8011 | 8012 | 8012 | 8013 | 8013 | 8014 | 8015 | 8016 | 8017 | 9000 | 9001 | 9002 | 9003 | 9004 | 9005 | 9006 | 9007 | 9008 | 9009 | 9010 | 9011 | 9012 | 9013 | 9014 | 9015 | 9016 | 9017 | 9018 | 9019 | 9020 | 9021 | 9022 | 9023 | 9024 | 9025 | 9026 | 9027 | 9028 | 9029 | 9030 | 10000 | 10001 | 10002 | 10061 | 10062 | 11000 | 11001 | 11002 | 11003 | 11004 | 11005 | 11006 | 11007 | 11008 | 11009 | 11010 | 11011 | 11012 | 11013 | 11014 | 11015 | 11016 | 11017 | 11018 | 11019 | 11020 | 11021 | 11022 | 11023 | 11024 | 11025 | 11026 | 11027 | 11028 | 11029 | 11030 | 11031 | 11032 | 11033 | 11034 | 11035 | 11036 | 11037 | 11038 | 11039 | 11040 | 11041 | 11042 | 11043 | 11044 | 11045 | 11046 | 11047 | 11048 | 11049 | 11050 | 11051 | 11052 | 11053 | 11054 | 11055 | 11056 | 11057 | -1;

export type ApiRequest = Record<string, unknown>;

/**
 * @description: 新增充值大类(双写V1+V3)
ThirdCurrency可多次添加(只校验名称唯一)，其它大类每个商户只能添加一次
本地充值大类(LocalBank/LocalUPI/LocalEWallet/LocalUSDT)新增后自动绑定匹配通道 (Auth) 响应
 * @url: /api/RechargeCategory/Add
 * @name: ApiResponse
 */
export interface ApiResponse<T = any> {
  data: T;
  code: number;
}

/**
 * @description: 批量取消本地充值订单 (Auth) 请求
 * @url: /api/RechargeOrder/BatchCancelLocalRechargeOrder
 * @name: BatchCancelLocalRechargeOrderReq
 */
export interface BatchCancelLocalRechargeOrderReq {
  /**
   * 订单号列表
   */
  orderNos: string[];
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 批量取消本地充值订单 (Auth) 响应
 * @url: /api/RechargeOrder/BatchCancelLocalRechargeOrder
 * @name: BatchCancelLocalRechargeOrderRsp
 */
export interface BatchCancelLocalRechargeOrderRsp {
  /**
   * 成功取消的订单号
   */
  successOrderNos: string[];
  /**
   * 取消失败的订单结果
   */
  failedResults: string[];
}

export type BatchCancelLocalRechargeOrderRspApiResponse = BatchCancelLocalRechargeOrderRsp;

/**
 * @description: 取消单笔本地充值订单 (Auth) 请求
 * @url: /api/RechargeOrder/CancelLocalRechargeOrder
 * @name: CancelLocalRechargeOrderReq
 */
export interface CancelLocalRechargeOrderReq {
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 0 - 无 1 - 是否支持验证银行 2 - 是否内置 4 - 代收代付调用三方时是否强制使用短UserId
 */
export type ChannelDictBoolAttrEnum = 0 | 1 | 2 | 4;

/**
 * @description: 获取系统充值大类枚举列表 (Auth) 请求
 * @url: /api/RechargeChannelDictionary/GetRechargeCategoryEnumList
 * @name: ChannelDictionaryCategoryEnumListReq
 */
export interface ChannelDictionaryCategoryEnumListReq {
  /**
   * 通道币种编码
   */
  sysCurrency?: string;
}

/**
 * @description: 三方待入款确认补单 (Auth) 请求
 * @url: /api/RechargeOrder/ConfirmThirdPendingRechargeOrder
 * @name: ConfirmRechargeOrderReq
 */
export interface ConfirmRechargeOrderReq {
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 实际充值金额
   */
  actualAmount?: number;
  /**
   * 优惠金额
   */
  giftAmount?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 0 - 禁用 1 - 启用
 */
export type EnableEnum = 0 | 1;

export interface IdNameRsp {
  /**
   * 
   */
  id: number;
  /**
   * 
   */
  name: string;
}

/**
 * @description: 获取系统充值大类枚举全量列表(根据商户币种筛选，不过滤上限) (Auth) 响应
 * @url: /api/RechargeCategory/GetRechargeCategoryEnumList
 * @name: IdNameRspListApiResponse
 */
export type IdNameRspListApiResponse = IdNameRsp[];

/**
 * @description: 删除充值通道 (Auth) 请求
 * @url: /api/RechargeChannel/Delete
 * @name: IdReq
 */
export interface IdReq {
  /**
   * 
   */
  id?: number;
}

/**
 * @description: 0 - en-English(英语) 1 - id-Indonesian(印度尼西亚语) 2 - vi-Vietnamese(越南语) 3 - pt-Portuguese(葡萄牙语) 4 - th-Thai(泰语) 5 - zh-Chinese(中文简体) 6 - zh-ChineseTW(中文繁体) 7 - my-Burmese(缅甸语) 8 - bn-Bengali(孟加拉语) 9 - hi-Hindi(印地语) 10 - ms-Malay(马来语) 11 - ur-Urdu(巴基斯坦-乌尔都语) 12 - ar-Arabic(阿拉伯语) 13 - ab-Abkhazian(阿布哈兹语) 14 - aa-Afar(阿法尔语) 15 - af-Afrikaans(南非语) 16 - ak-Akan(阿坎语) 17 - sq-Albanian(阿尔巴尼亚语) 18 - am-Amharic(阿姆哈拉语) 19 - an-Aragonese(阿拉贡语) 20 - hy-Armenian(亚美尼亚语) 21 - av-Avaric(阿瓦尔语) 22 - ae-Avestan(阿维斯陀语) 23 - ay-Aymara(艾马拉语巴斯克语) 24 - az-Azerbaijani(阿塞拜疆语) 25 - bm-Bambara(班巴拉语) 26 - ba-Bashkir(巴什基尔语) 27 - eu-Basque(巴斯克语) 28 - be-Belarusian(白俄罗斯语) 29 - bh-Bihari languages(比哈尔语) 30 - bi-Bislama(比斯拉马语) 31 - bs-Bosnian(波斯尼亚语) 32 - br-Breton(布列塔尼语) 33 - bg-Bulgarian(保加利亚语) 34 - ca-Catalan, Valencian(加泰罗尼亚语) 35 - ch-Chamorro(查莫罗语) 36 - ce-Chechen(车臣语) 37 - ny-Chichewa, Chewa, Nyanja(齐切瓦语) 38 - cv-Chuvash(楚瓦什语) 39 - kw-Cornish(康沃尔语) 40 - co-Corsican(科西嘉语) 41 - cr-Cree(克里语) 42 - hr-Croatian(克罗地亚语) 43 - cs-Czech(捷克语) 44 - da-Danish(丹麦语) 45 - dv-Divehi, Dhivehi, Maldivian(迪维希语) 46 - nl-Dutch, Flemish(荷兰语) 47 - dz-Dzongkha(宗喀语) 48 - eo-Esperanto(世界语) 49 - et-Estonian(爱沙尼亚语) 50 - ee-Ewe(埃维语) 51 - fo-Faroese(法罗语) 52 - fj-Fijian(斐济语) 53 - fi-Finnish(芬兰语) 54 - fr-French(法语) 55 - ff-Fulah(富拉语) 56 - gl-Galician(加利西亚语) 57 - ka-Georgian(格鲁吉亚语) 58 - de-German(德语) 59 - el-Greek(希腊语（现代，1453–）) 60 - gn-Guarani(瓜拉尼语) 61 - gu-Gujarati(古吉拉特语) 62 - ht-Haitian, Haitian Creole(海地克里奥尔语) 63 - ha-Hausa(豪萨语) 64 - he-Hebrew(希伯来语) 65 - hz-Herero(赫雷罗语) 66 - ho-Hiri Motu(希里摩图语) 67 - hu-Hungarian(匈牙利语) 68 - ia-Interlingua(国际语) 69 - ie-Interlingue, Occidental(西方国际语) 70 - ga-Irish(爱尔兰语) 71 - ig-Igbo(伊博语) 72 - ik-Inupiaq(因纽皮雅特语) 73 - io-Ido(伊多语) 74 - it-Italian(意大利语) 75 - iu-Inuktitut(伊努克提图特语) 76 - ja-Japanese(日语) 77 - jv-Javanese(爪哇语) 78 - kl-Kalaallisut, Greenlandic(格陵兰语) 79 - kn-Kannada(卡纳达语) 80 - kr-Kanuri(卡努里语) 81 - ks-Kashmiri(克什米尔语) 82 - kk-Kazakh(哈萨克语) 83 - km-Central Khmer(高棉语) 84 - ki-Kikuyu, Gikuyu(基库尤语) 85 - rw-Kinyarwanda(卢旺达语) 86 - ky-Kirghiz, Kyrgyz(柯尔克孜语) 87 - kv-Komi(科米语) 88 - kg-Kongo(刚果语) 89 - ko-Korean(朝鲜语) 90 - ku-Kurdish(库尔德语) 91 - kj-Kuanyama, Kwanyama(宽亚玛语) 92 - la-Latin(拉丁语) 93 - lb-Luxembourgish, Letzeburgesch(卢森堡语) 94 - lg-Ganda(卢干达语) 95 - li-Limburgan, Limburger, Limburgish(林堡语) 96 - ln-Lingala(林加拉语) 97 - lo-Lao(老挝语) 98 - lt-Lithuanian(立陶宛语) 99 - lu-Luba-Katanga(卢巴卡丹加语) 100 - lv-Latvian(拉脱维亚语) 101 - gv-Manx(马恩岛语) 102 - mk-Macedonian(马其顿语) 103 - mg-Malagasy(马达加斯加语) 104 - ml-Malayalam(马拉雅拉姆语) 105 - mt-Maltese(马耳他语) 106 - mi-Maori(毛利语) 107 - mr-Marathi(马拉地语) 108 - mh-Marshallese(马绍尔语) 109 - mn-Mongolian(蒙古语) 110 - na-Nauru(瑙鲁语) 111 - nv-Navajo, Navaho(纳瓦荷语) 112 - nd-North Ndebele(北恩德贝莱语) 113 - ne-Nepali(尼泊尔语) 114 - ng-Ndonga(恩敦加语) 115 - nb-Norwegian Bokmål(书面挪威语) 116 - nn-Norwegian Nynorsk(新挪威语) 117 - no-Norwegian(挪威语) 118 - ii-Sichuan Yi, Nuosu(彝语北部方言) 119 - nr-South Ndebele(南恩德贝莱语) 120 - oc-Occitan(奥克语) 121 - oj-Ojibwa(奥吉布瓦语) 122 - cu-Church Slavic(教会斯拉夫语) 123 - om-Oromo(奥罗莫语) 124 - or-Oriya(奥里亚语) 125 - os-Ossetian, Ossetic(奥塞梯语) 126 - pa-Punjabi, Panjabi(旁遮普语) 127 - pi-Pali(巴利语) 128 - fa-Persian(波斯语) 129 - pl-Polish(波兰语) 130 - ps-Pashto, Pushto(普什图语) 131 - qu-Quechua(克丘亚语) 132 - rm-Romansh(罗曼什语) 133 - rn-Rundi(基隆迪语) 134 - ro-Romanian, Moldavian, Moldovan(罗马尼亚语) 135 - ru-Russian(俄语) 136 - sa-Sanskrit(梵语) 137 - sc-Sardinian(萨丁尼亚语) 138 - sd-Sindhi(信德语) 139 - se-Northern Sami(北萨米语) 140 - sm-Samoan(萨摩亚语) 141 - sg-Sango(桑戈语) 142 - sr-Serbian(塞尔维亚语) 143 - gd-Gaelic,(苏格兰盖尔语) 144 - sn-Shona(绍纳语) 145 - si-Sinhala, Sinhalese(僧伽罗语) 146 - sk-Slovak(斯洛伐克语) 147 - sl-Slovenian(斯洛文尼亚语) 148 - so-Somali(索马里语) 149 - st-Southern Sotho(塞索托语) 150 - es-Spanish, Castilian(西班牙语) 151 - su-Sundanese(巽他语) 152 - sw-Swahili(斯瓦希里语) 153 - ss-Swati(史瓦帝语) 154 - sv-Swedish(瑞典语) 155 - ta-Tamil(泰米尔语) 156 - te-Telugu(泰卢固语) 157 - tg-Tajik(塔吉克语) 158 - ti-Tigrinya(提格利尼亚语) 159 - bo-Tibetan(藏语) 160 - tk-Turkmen(土库曼语) 161 - tl-Tagalog(他加禄语) 162 - tn-Tswana(茨瓦纳语) 163 - to-Tonga(汤加语) 164 - tr-Turkish(土耳其语) 165 - ts-Tsonga(聪加语) 166 - tt-Tatar(鞑靼语) 167 - tw-Twi(契维语) 168 - ty-Tahitian(塔希提语) 169 - ug-Uighur, Uyghur(维吾尔语) 170 - uk-Ukrainian(乌克兰语) 171 - uz-Uzbek(乌孜别克语) 172 - ve-Venda(文达语) 173 - vo-Volapük(沃拉普克语) 174 - wa-Walloon(瓦隆语) 175 - cy-Welsh(威尔士语) 176 - wo-Wolof(沃洛夫语) 177 - fy-West Frisian(弗里斯兰语) 178 - xh-Xhosa(科萨语) 179 - yi-Yiddish(意第绪语) 180 - yo-Yoruba(约鲁巴语) 181 - za-Zhuang, Chuang(壮语) 182 - zu-Zulu(祖鲁语)
 */
export type LanguageEnum = "en-English(英语)" | "id-Indonesian(印度尼西亚语)" | "vi-Vietnamese(越南语)" | "pt-Portuguese(葡萄牙语)" | "th-Thai(泰语)" | "zh-Chinese(中文简体)" | "zh-ChineseTW(中文繁体)" | "my-Burmese(缅甸语)" | "bn-Bengali(孟加拉语)" | "hi-Hindi(印地语)" | "ms-Malay(马来语)" | "ur-Urdu(巴基斯坦-乌尔都语)" | "ar-Arabic(阿拉伯语)" | "ab-Abkhazian(阿布哈兹语)" | "aa-Afar(阿法尔语)" | "af-Afrikaans(南非语)" | "ak-Akan(阿坎语)" | "sq-Albanian(阿尔巴尼亚语)" | "am-Amharic(阿姆哈拉语)" | "an-Aragonese(阿拉贡语)" | "hy-Armenian(亚美尼亚语)" | "av-Avaric(阿瓦尔语)" | "ae-Avestan(阿维斯陀语)" | "ay-Aymara(艾马拉语巴斯克语)" | "az-Azerbaijani(阿塞拜疆语)" | "bm-Bambara(班巴拉语)" | "ba-Bashkir(巴什基尔语)" | "eu-Basque(巴斯克语)" | "be-Belarusian(白俄罗斯语)" | "bh-Bihari languages(比哈尔语)" | "bi-Bislama(比斯拉马语)" | "bs-Bosnian(波斯尼亚语)" | "br-Breton(布列塔尼语)" | "bg-Bulgarian(保加利亚语)" | "ca-Catalan, Valencian(加泰罗尼亚语)" | "ch-Chamorro(查莫罗语)" | "ce-Chechen(车臣语)" | "ny-Chichewa, Chewa, Nyanja(齐切瓦语)" | "cv-Chuvash(楚瓦什语)" | "kw-Cornish(康沃尔语)" | "co-Corsican(科西嘉语)" | "cr-Cree(克里语)" | "hr-Croatian(克罗地亚语)" | "cs-Czech(捷克语)" | "da-Danish(丹麦语)" | "dv-Divehi, Dhivehi, Maldivian(迪维希语)" | "nl-Dutch, Flemish(荷兰语)" | "dz-Dzongkha(宗喀语)" | "eo-Esperanto(世界语)" | "et-Estonian(爱沙尼亚语)" | "ee-Ewe(埃维语)" | "fo-Faroese(法罗语)" | "fj-Fijian(斐济语)" | "fi-Finnish(芬兰语)" | "fr-French(法语)" | "ff-Fulah(富拉语)" | "gl-Galician(加利西亚语)" | "ka-Georgian(格鲁吉亚语)" | "de-German(德语)" | "el-Greek(希腊语（现代，1453–）)" | "gn-Guarani(瓜拉尼语)" | "gu-Gujarati(古吉拉特语)" | "ht-Haitian, Haitian Creole(海地克里奥尔语)" | "ha-Hausa(豪萨语)" | "he-Hebrew(希伯来语)" | "hz-Herero(赫雷罗语)" | "ho-Hiri Motu(希里摩图语)" | "hu-Hungarian(匈牙利语)" | "ia-Interlingua(国际语)" | "ie-Interlingue, Occidental(西方国际语)" | "ga-Irish(爱尔兰语)" | "ig-Igbo(伊博语)" | "ik-Inupiaq(因纽皮雅特语)" | "io-Ido(伊多语)" | "it-Italian(意大利语)" | "iu-Inuktitut(伊努克提图特语)" | "ja-Japanese(日语)" | "jv-Javanese(爪哇语)" | "kl-Kalaallisut, Greenlandic(格陵兰语)" | "kn-Kannada(卡纳达语)" | "kr-Kanuri(卡努里语)" | "ks-Kashmiri(克什米尔语)" | "kk-Kazakh(哈萨克语)" | "km-Central Khmer(高棉语)" | "ki-Kikuyu, Gikuyu(基库尤语)" | "rw-Kinyarwanda(卢旺达语)" | "ky-Kirghiz, Kyrgyz(柯尔克孜语)" | "kv-Komi(科米语)" | "kg-Kongo(刚果语)" | "ko-Korean(朝鲜语)" | "ku-Kurdish(库尔德语)" | "kj-Kuanyama, Kwanyama(宽亚玛语)" | "la-Latin(拉丁语)" | "lb-Luxembourgish, Letzeburgesch(卢森堡语)" | "lg-Ganda(卢干达语)" | "li-Limburgan, Limburger, Limburgish(林堡语)" | "ln-Lingala(林加拉语)" | "lo-Lao(老挝语)" | "lt-Lithuanian(立陶宛语)" | "lu-Luba-Katanga(卢巴卡丹加语)" | "lv-Latvian(拉脱维亚语)" | "gv-Manx(马恩岛语)" | "mk-Macedonian(马其顿语)" | "mg-Malagasy(马达加斯加语)" | "ml-Malayalam(马拉雅拉姆语)" | "mt-Maltese(马耳他语)" | "mi-Maori(毛利语)" | "mr-Marathi(马拉地语)" | "mh-Marshallese(马绍尔语)" | "mn-Mongolian(蒙古语)" | "na-Nauru(瑙鲁语)" | "nv-Navajo, Navaho(纳瓦荷语)" | "nd-North Ndebele(北恩德贝莱语)" | "ne-Nepali(尼泊尔语)" | "ng-Ndonga(恩敦加语)" | "nb-Norwegian Bokmål(书面挪威语)" | "nn-Norwegian Nynorsk(新挪威语)" | "no-Norwegian(挪威语)" | "ii-Sichuan Yi, Nuosu(彝语北部方言)" | "nr-South Ndebele(南恩德贝莱语)" | "oc-Occitan(奥克语)" | "oj-Ojibwa(奥吉布瓦语)" | "cu-Church Slavic(教会斯拉夫语)" | "om-Oromo(奥罗莫语)" | "or-Oriya(奥里亚语)" | "os-Ossetian, Ossetic(奥塞梯语)" | "pa-Punjabi, Panjabi(旁遮普语)" | "pi-Pali(巴利语)" | "fa-Persian(波斯语)" | "pl-Polish(波兰语)" | "ps-Pashto, Pushto(普什图语)" | "qu-Quechua(克丘亚语)" | "rm-Romansh(罗曼什语)" | "rn-Rundi(基隆迪语)" | "ro-Romanian, Moldavian, Moldovan(罗马尼亚语)" | "ru-Russian(俄语)" | "sa-Sanskrit(梵语)" | "sc-Sardinian(萨丁尼亚语)" | "sd-Sindhi(信德语)" | "se-Northern Sami(北萨米语)" | "sm-Samoan(萨摩亚语)" | "sg-Sango(桑戈语)" | "sr-Serbian(塞尔维亚语)" | "gd-Gaelic,(苏格兰盖尔语)" | "sn-Shona(绍纳语)" | "si-Sinhala, Sinhalese(僧伽罗语)" | "sk-Slovak(斯洛伐克语)" | "sl-Slovenian(斯洛文尼亚语)" | "so-Somali(索马里语)" | "st-Southern Sotho(塞索托语)" | "es-Spanish, Castilian(西班牙语)" | "su-Sundanese(巽他语)" | "sw-Swahili(斯瓦希里语)" | "ss-Swati(史瓦帝语)" | "sv-Swedish(瑞典语)" | "ta-Tamil(泰米尔语)" | "te-Telugu(泰卢固语)" | "tg-Tajik(塔吉克语)" | "ti-Tigrinya(提格利尼亚语)" | "bo-Tibetan(藏语)" | "tk-Turkmen(土库曼语)" | "tl-Tagalog(他加禄语)" | "tn-Tswana(茨瓦纳语)" | "to-Tonga(汤加语)" | "tr-Turkish(土耳其语)" | "ts-Tsonga(聪加语)" | "tt-Tatar(鞑靼语)" | "tw-Twi(契维语)" | "ty-Tahitian(塔希提语)" | "ug-Uighur, Uyghur(维吾尔语)" | "uk-Ukrainian(乌克兰语)" | "uz-Uzbek(乌孜别克语)" | "ve-Venda(文达语)" | "vo-Volapük(沃拉普克语)" | "wa-Walloon(瓦隆语)" | "cy-Welsh(威尔士语)" | "wo-Wolof(沃洛夫语)" | "fy-West Frisian(弗里斯兰语)" | "xh-Xhosa(科萨语)" | "yi-Yiddish(意第绪语)" | "yo-Yoruba(约鲁巴语)" | "za-Zhuang, Chuang(壮语)" | "zu-Zulu(祖鲁语)";

/**
 * @description: 获取系统充值大类枚举全量列表(根据商户币种筛选，不过滤上限) (Auth) 请求
 * @url: /api/RechargeCategory/GetRechargeCategoryEnumList
 * @name: MasterApiRequest
 */
export interface MasterApiRequest {
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface MerchantChannelTreeCategoryRsp {
  /**
   * 大类ID（对应大类表主键ID）
   */
  categoryId: number;
}

export interface MerchantChannelTreeChildRsp {
  /**
   * 通道ID，格式：三方商户ID,通道字典ID（如 "1001,2001"）
   */
  channelId: string;
  /**
   * 是否已被使用
   */
  disabled: boolean;
}

/**
 * @description: 获取充值通道新增场景的商户通道树形数据 (Auth) 请求
 * @url: /api/RechargeChannel/GetMerchantChannelTree
 * @name: MerchantChannelTreeReq
 */
export interface MerchantChannelTreeReq {
  /**
   * 三方映射码（选填，传值时返回该PayCode下的三方商户和通道树形数据）
   */
  payCode?: string;
  /**
   * 商户ID（必填，用于获取该商户下的三方映射码及判断已存在的组合）
   */
  tenantId: number;
  /**
   * 通道节点值，格式：三方商户ID,通道字典ID（选填，传值时返回该通道关联的大类列表）
   */
  channelId?: string;
}

export interface MerchantChannelTreeRsp {
  /**
   * 三方商户ID
   */
  thirdPayMerchantId: number;
  /**
   * 子节点：关联通道列表
   */
  childrens: MerchantChannelTreeChildRsp[];
}

/**
 * @description: 获取充值通道新增场景的商户通道树形数据 (Auth) 响应
 * @url: /api/RechargeChannel/GetMerchantChannelTree
 * @name: MerchantChannelTreeWrapperRsp
 */
export interface MerchantChannelTreeWrapperRsp {
  /**
   * 三方映射码列表（按商户ID从tab_thirdpay_tenantchannel获取，去重、移除内置）
   */
  payCodes: string[];
  /**
   * 币种列表（按选中的PayCode从通道字典获取，去重）
   */
  sysCurrencies: string[];
  /**
   * 三方商户-通道树形数据（选中PayCode后返回）
   */
  merchantChannelTree: MerchantChannelTreeRsp[];
  /**
   * 大类列表（选择通道节点后返回，对应大类表主键ID和前台显示名称）
   */
  category: MerchantChannelTreeCategoryRsp[];
}

export type MerchantChannelTreeWrapperRspApiResponse = MerchantChannelTreeWrapperRsp;

/**
 * @description: 1 - Desc 2 - Asc
 */
export type OrderByEnum = "Desc" | "Asc";

/**
 * @description: 获取查询场景的三方映射码下拉数据 (Auth) 响应
 * @url: /api/ThirdPayMerchant/GetThirdPayMerchantSelectData
 * @name: PayCodeCurrencySelectRsp
 */
export interface PayCodeCurrencySelectRsp {
  /**
   * 三方映射码列表（去重）
   */
  payCodes: string[];
  /**
   * 币种列表（去重，按PayCode过滤后返回）
   */
  sysCurrencies: string[];
  /**
   * 三方商户展示名称列表（去重，格式：昵称(商户号)）
   */
  customNames: string[];
}

export type PayCodeCurrencySelectRspApiResponse = PayCodeCurrencySelectRsp;

/**
 * @description: 获取新增场景的三方映射码下拉数据 (Auth) 请求
 * @url: /api/ThirdPayMerchant/GetPayCodeSelectData
 * @name: PayCodeSelectDataReq
 */
export interface PayCodeSelectDataReq {
  /**
   * 是否加载内置三方映射码，默认false不加载内置，true时加载全部（含内置）
   */
  isBuiltIn?: boolean;
  /**
   * 三方映射码（传值时查询对应的三方商户昵称/商户号）
   */
  payCode?: string;
  /**
   * 币种（选填，传值时按币种筛选对应的三方映射码）
   */
  sysCurrency?: string;
}

/**
 * @description: 0 - 未知 1 - 唤醒 2 - 原生 3 - 扫码
 */
export type PayModeEnum = 0 | 1 | 2 | 3;

/**
 * @description: 1 - 赠送比率 2 - 赠送金额
 */
export type QuickConfigGiftTypeEnum = 1 | 2;

export interface QuickConfigItem {
  /**
   * 快捷金额
   */
  amount?: number;
  /**
   * 
   */
  giftType?: QuickConfigGiftTypeEnum;
  /**
   * 赠送数额(GiftType=1时为比率百分比, GiftType=2时为固定金额)
   */
  giftValue?: number;
}

/**
 * @description: 新增充值大类(双写V1+V3)
ThirdCurrency可多次添加(只校验名称唯一)，其它大类每个商户只能添加一次
本地充值大类(LocalBank/LocalUPI/LocalEWallet/LocalUSDT)新增后自动绑定匹配通道 (Auth) 请求
 * @url: /api/RechargeCategory/Add
 * @name: RechargeCategoryAddReq
 */
export interface RechargeCategoryAddReq {
  /**
   * 大类名称
   */
  customName: string;
  /**
   * 
   */
  rechargeCategory?: RechargeCategoryEnum;
  /**
   * 排序
   */
  sort: number;
  /**
   * 选中前图标URL
   */
  iconUrl: string;
  /**
   * 选中后图标URL
   */
  selectedIconUrl: string;
  /**
   * 充值等级
   */
  rechargeLevel?: string;
  /**
   * 优惠可用等级
   */
  discountLevel?: string;
  /**
   * 快捷金额配置
   */
  quickConfig?: QuickConfigItem[];
  /**
   * 用户最大待支付订单数量
   */
  limitUserMaxPendingOrders?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取充值大类详情 (Auth) 响应
 * @url: /api/RechargeCategory/Get
 * @name: RechargeCategoryDetailRsp
 */
export interface RechargeCategoryDetailRsp {
  /**
   * 充值大类ID
   */
  id: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户自定义名称
   */
  customName: string;
  /**
   * 
   */
  rechargeCategory: RechargeCategoryEnum;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 排序
   */
  sort: number;
  /**
   * 选中前图标
   */
  iconUrl: string;
  /**
   * 选中后图标
   */
  selectedIconUrl: string;
  /**
   * 充值等级
   */
  rechargeLevel: string;
  /**
   * 优惠可用等级
   */
  discountLevel: string;
  /**
   * 快捷金额配置
   */
  quickConfig: QuickConfigItem[];
  /**
   * 用户最大待支付订单数量
   */
  limitUserMaxPendingOrders: number;
  /**
   * 充值赠送比例类型(1:正向,2:反向)
   */
  giftRatioType: number;
  /**
   * 比例类型(1:统一比例,2:区间比例)
   */
  scaleType: number;
  /**
   * 比例配置(JSON)
   */
  scaleConfig: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 修改人
   */
  lastUpdateMan: string;
  /**
   * 修改时间
   */
  lastUpdateTime: number;
}

export type RechargeCategoryDetailRspApiResponse = RechargeCategoryDetailRsp;

/**
 * @description: 1 - 三方法币 9 - 本地银行卡 11 - 三方Usdt 12 - 本地UPI 14 - 三方银行卡 18 - 本地电子钱包 19 - 本地USDT 21 - ARPay 26 - ArUpiPay
 */
export type RechargeCategoryEnum = 1 | 9 | 11 | 12 | 14 | 18 | 19 | 21 | 26;

/**
 * @description: 获取充值大类详情 (Auth) 请求
 * @url: /api/RechargeCategory/Get
 * @name: RechargeCategoryGetReq
 */
export interface RechargeCategoryGetReq {
  /**
   * 充值大类ID
   */
  id?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页查询充值大类列表
V3无数据时自动从V1同步 (Auth) 请求
 * @url: /api/RechargeCategory/GetPageList
 * @name: RechargeCategoryListReq
 */
export interface RechargeCategoryListReq {
  /**
   * 充值大类(前台显示名称)
   */
  customName?: string;
  /**
   * 
   */
  state?: EnableEnum;
  /**
   * 商户Id
   */
  tenantId?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 排序字段
   */
  sortField?: string;
  /**
   * 
   */
  orderBy: OrderByEnum;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

export interface RechargeCategoryListRsp {
  /**
   * 充值大类ID
   */
  id: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户自定义名称
   */
  customName: string;
  /**
   * 
   */
  rechargeCategory: RechargeCategoryEnum;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 排序
   */
  sort: number;
  /**
   * 选中前图标
   */
  iconUrl: string;
  /**
   * 选中后图标
   */
  selectedIconUrl: string;
  /**
   * 充值等级
   */
  rechargeLevel: string;
  /**
   * 优惠可用等级
   */
  discountLevel: string;
  /**
   * 快捷金额配置
   */
  quickConfig: QuickConfigItem[];
  /**
   * 用户最大待支付订单数量
   */
  limitUserMaxPendingOrders: number;
  /**
   * 充值赠送比例类型(1:正向,2:反向)
   */
  giftRatioType: number;
  /**
   * 比例类型(1:统一比例,2:区间比例)
   */
  scaleType: number;
  /**
   * 比例配置(JSON)
   */
  scaleConfig: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 修改人
   */
  lastUpdateMan: string;
  /**
   * 修改时间
   */
  lastUpdateTime: number;
}

/**
 * @description: 分页查询充值大类列表
V3无数据时自动从V1同步 (Auth) 响应
 * @url: /api/RechargeCategory/GetPageList
 * @name: RechargeCategoryListRspListPageBaseResponse
 */
export interface RechargeCategoryListRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: RechargeCategoryListRsp[];
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总行数
   */
  totalCount: number;
}

export type RechargeCategoryListRspListPageBaseResponseApiResponse = RechargeCategoryListRspListPageBaseResponse;

/**
 * @description: 变更状态(双写V1+V3) (Auth) 请求
 * @url: /api/RechargeCategory/UpdateState
 * @name: RechargeCategoryStateReq
 */
export interface RechargeCategoryStateReq {
  /**
   * 充值大类ID
   */
  id?: number;
  /**
   * 
   */
  state?: EnableEnum;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 编辑充值大类(双写V1+V3) (Auth) 请求
 * @url: /api/RechargeCategory/Update
 * @name: RechargeCategoryUpdateReq
 */
export interface RechargeCategoryUpdateReq {
  /**
   * 充值大类ID
   */
  id?: number;
  /**
   * 大类名称
   */
  customName: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 选中前图标URL
   */
  iconUrl: string;
  /**
   * 选中后图标URL
   */
  selectedIconUrl: string;
  /**
   * 快捷金额配置
   */
  quickConfig?: QuickConfigItem[];
  /**
   * 用户最大待支付订单数量
   */
  limitUserMaxPendingOrders?: number;
  /**
   * 
   */
  state?: EnableEnum;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 批量新增充值通道 (Auth) 请求
 * @url: /api/RechargeChannel/BatchAdd
 * @name: RechargeChannelBatchAddReq
 */
export interface RechargeChannelBatchAddReq {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 三方映射码
   */
  payCode: string;
  /**
   * 通道ID列表，格式：["三方商户ID,通道字典ID", ...]
   */
  channelIds: string[];
  /**
   * 三方通道编码
   */
  thirdChannelCode?: string;
  /**
   * 充值大类ID
   */
  channelCategoryId: number;
  /**
   * 出款显示名称
   */
  customName: string;
  /**
   * 轮询权重
   */
  weight?: number;
  /**
   * 可见等级（多选，如 "LV1","LV3","LV5"，存储时按逗号分隔）
   */
  allowRechargeLevel?: string;
  /**
   * 可用开始时间(HH:mm格式)
   */
  allowStartTime: string;
  /**
   * 可用结束时间(HH:mm格式)
   */
  allowEndTime: string;
  /**
   * 最小充值金额
   */
  minAmount?: number;
  /**
   * 最大充值金额
   */
  maxAmount?: number;
  /**
   * 手续费率
   */
  serviceFeeRate?: number;
  /**
   * 自动关闭余额阈值
   */
  autoCloseBalance?: number;
  /**
   * 布尔属性
   */
  boolAttr?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态(1:开启, 0:关闭)
   */
  state: number;
}

/**
 * @description: 获取充值通道详情 (Auth) 响应
 * @url: /api/RechargeChannel/Get
 * @name: RechargeChannelDetailRsp
 */
export interface RechargeChannelDetailRsp {
  /**
   * 可见等级
   */
  allowRechargeLevel: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 主键ID
   */
  id: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 充值大类ID
   */
  channelCategoryId: number;
  /**
   * 充值通道ID
   */
  channelId: number;
  /**
   * 三方通道编码(tab_thirdpay_tenantchannel.ThirdChannelCode)
   */
  thirdChannelCode: string;
  /**
   * 通道币种(RechargeChannelEntity.SysCurrency)
   */
  sysCurrency: string;
  /**
   * 出款显示名称(tab_thirdpay_tenantchannel.CustomName)
   */
  customName: string;
  /**
   * 三方商户ID
   */
  thirdPayMerchantId: number;
  /**
   * 三方商户号(ThirdPayMerchantEntity.MerchantCode)
   */
  merchantCode: string;
  /**
   * 三方商户状态(1:开启 0:关闭)
   */
  merchantState: number;
  /**
   * 支付厂商编码(用于判断是否内置通道,如SystemBuiltIn)
   */
  payCode: string;
  /**
   * 状态(1:开启, 0:关闭) - tab_thirdpay_tenantchannel.State
   */
  state: number;
  /**
   * 通道状态(1:开启, 0:关闭) - tab_recharge_channel.State
   */
  channelState: number;
  /**
   * 轮询权重
   */
  weight: number;
  /**
   * 实时权重
   */
  realTimeWeight: number;
  /**
   * 成功率统计(预留，后续对接统计表)
   */
  successRateInfo: string;
  /**
   * 近10分钟成功数/总提交数
   */
  recent15MinutesCount: number;
  /**
   * 近30分钟成功数/总提交数
   */
  recent30MinutesCount: number;
  /**
   * 近1小时成功数/总提交数
   */
  recent1HourCount: number;
  /**
   * 当日成功数/总提交数
   */
  recent24HoursCount: number;
  /**
   * 今日已处理数
   */
  todayProcessedCount: number;
  /**
   * 总处理数
   */
  totalProcessedCount: number;
  /**
   * 可用开始时间
   */
  allowStartTime: string;
  /**
   * 可用结束时间
   */
  allowEndTime: string;
  /**
   * 最小充值金额
   */
  minAmount: number;
  /**
   * 最大充值金额
   */
  maxAmount: number;
  /**
   * 手续费率
   */
  serviceFeeRate: number;
  /**
   * 自动关闭余额阈值(余额低于此值后自动关闭，0不处理)
   */
  autoCloseBalance: number;
  /**
   * 是否整百提现(位属性)
   */
  boolAttr: number;
  /**
   * 代收测试是否支持UTR
   */
  isSupportUtrTest: boolean;
  /**
   * 备注
   */
  remark: string;
  /**
   * 最后修改人
   */
  lastUpdateMan: string;
  /**
   * 最后修改时间
   */
  lastUpdateTime: number;
}

export type RechargeChannelDetailRspApiResponse = RechargeChannelDetailRsp;

/**
 * @description: 获取充值通道字典详情 (Auth) 响应
 * @url: /api/RechargeChannelDictionary/Get
 * @name: RechargeChannelDictionaryDetailRsp
 */
export interface RechargeChannelDictionaryDetailRsp {
  /**
   * ID
   */
  id: number;
  /**
   * 通道名称
   */
  name: string;
  /**
   * 充值大类Id
   */
  categoryId: number;
  /**
   * 厂商编码
   */
  payCode: string;
  /**
   * 三方通道编码
   */
  thirdChannelCode: string;
  /**
   * 自定义参数
   */
  parameters: string;
  /**
   * 币种编码
   */
  sysCurrency: string;
  /**
   * 三方网关地址
   */
  thirdPayApiUrl: string;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 
   */
  boolAttr: ChannelDictBoolAttrEnum;
  /**
   * 支付模式
   */
  payMode: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 当前币种下可选的内置充值大类
   */
  availableCategoryList: IdNameRsp[];
}

export type RechargeChannelDictionaryDetailRspApiResponse = RechargeChannelDictionaryDetailRsp;

/**
 * @description: 充值通道字典分页查询 (Auth) 请求
 * @url: /api/RechargeChannelDictionary/GetPageList
 * @name: RechargeChannelDictionaryListReq
 */
export interface RechargeChannelDictionaryListReq {
  /**
   * 通道名称
   */
  name?: string;
  /**
   * 充值大类Id
   */
  categoryId?: number;
  /**
   * 厂商编码
   */
  payCode?: string;
  /**
   * 
   */
  payMode?: PayModeEnum;
  /**
   * 币种编码
   */
  sysCurrency?: string;
  /**
   * 
   */
  state?: EnableEnum;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 排序字段
   */
  sortField?: string;
  /**
   * 
   */
  orderBy: OrderByEnum;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

/**
 * @description: 修改充值通道字典 (Auth) 请求
 * @url: /api/RechargeChannelDictionary/Update
 * @name: RechargeChannelDictionaryModelReq
 */
export interface RechargeChannelDictionaryModelReq {
  /**
   * 主键(新增时为0，编辑时大于0)
   */
  id?: number;
  /**
   * 通道名称
   */
  name?: string;
  /**
   * 系统充值大类ID
   */
  sysCategoryId?: number;
  /**
   * 三方映射码
   */
  payCode?: string;
  /**
   * 三方通道编码
   */
  thirdChannelCode?: string;
  /**
   * 自定义参数
   */
  parameters?: string;
  /**
   * 币种编码
   */
  sysCurrency?: string;
  /**
   * 三方网关地址
   */
  thirdPayApiUrl: string;
  /**
   * 状态 0=禁用 1=启用
   */
  state?: number;
  /**
   * 是否验证银行
   */
  boolAttr?: boolean;
  /**
   * 支付模式
   */
  payMode?: number;
  /**
   * 备注
   */
  remark?: string;
}

export interface RechargeChannelDictionaryRsp {
  /**
   * ID
   */
  id: number;
  /**
   * 通道名称
   */
  name: string;
  /**
   * 充值大类Id
   */
  categoryId: number;
  /**
   * 厂商编码
   */
  payCode: string;
  /**
   * 三方通道编码
   */
  thirdChannelCode: string;
  /**
   * 自定义参数
   */
  parameters: string;
  /**
   * 币种编码
   */
  sysCurrency: string;
  /**
   * 三方网关地址
   */
  thirdPayApiUrl: string;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 
   */
  boolAttr: ChannelDictBoolAttrEnum;
  /**
   * 支付模式
   */
  payMode: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 最后修改人
   */
  lastUpdateMan: string;
  /**
   * 最后修改时间
   */
  lastUpdateTime: number;
}

/**
 * @description: 充值通道字典分页查询 (Auth) 响应
 * @url: /api/RechargeChannelDictionary/GetPageList
 * @name: RechargeChannelDictionaryRspListPageBaseResponse
 */
export interface RechargeChannelDictionaryRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: RechargeChannelDictionaryRsp[];
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总行数
   */
  totalCount: number;
}

export type RechargeChannelDictionaryRspListPageBaseResponseApiResponse = RechargeChannelDictionaryRspListPageBaseResponse;

/**
 * @description: 充值通道分页查询 (Auth) 请求
 * @url: /api/RechargeChannel/GetPageList
 * @name: RechargeChannelListReq
 */
export interface RechargeChannelListReq {
  /**
   * 商户ID
   */
  tenantId?: number;
  /**
   * 通道ID（tab_thirdpay_tenantchannel.Id）
   */
  channelId?: number;
  /**
   * 三方映射码
   */
  payCode?: string;
  /**
   * 三方通道编码
   */
  thirdChannelCode?: string;
  /**
   * 通道名称
   */
  channelName?: string;
  /**
   * 三方商户昵称
   */
  merchantName?: string;
  /**
   * 充值大类ID
   */
  channelCategoryId?: number;
  /**
   * 通道币种
   */
  sysCurrency?: string;
  /**
   * 状态(1:开启, 0:关闭)
   */
  state?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 排序字段
   */
  sortField?: string;
  /**
   * 
   */
  orderBy: OrderByEnum;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

/**
 * @description: 修改充值通道 (Auth) 请求
 * @url: /api/RechargeChannel/Update
 * @name: RechargeChannelModelReq
 */
export interface RechargeChannelModelReq {
  /**
   * 主键(新增时为0，编辑时>0)
   */
  id?: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 三方映射码
   */
  payCode: string;
  /**
   * 充值通道ID(关联tab_recharge_channel，对应三方映射码、通道名称、通道币种)
   */
  channelId: number;
  /**
   * 三方商户ID(关联tab_thirdpay_merchant)
   */
  thirdPayMerchantId?: number;
  /**
   * 三方通道编码
   */
  thirdChannelCode?: string;
  /**
   * 三方商户昵称
   */
  merchantName?: string;
  /**
   * 充值大类ID(前台显示名称)
   */
  channelCategoryId: number;
  /**
   * 出款显示名称
   */
  customName: string;
  /**
   * 轮询权重
   */
  weight: number;
  /**
   * 可见等级（多选，如 ["LV1","LV3","LV5"]，存储时按逗号分隔）
   */
  allowRechargeLevel?: string[];
  /**
   * 可用开始时间(HH:mm格式)
   */
  allowStartTime: string;
  /**
   * 可用结束时间(HH:mm格式)
   */
  allowEndTime: string;
  /**
   * 最小充值金额
   */
  minAmount?: number;
  /**
   * 最大充值金额
   */
  maxAmount?: number;
  /**
   * 手续费率
   */
  serviceFeeRate?: number;
  /**
   * 自动关闭余额阈值(余额低于此值后自动关闭，0不处理)
   */
  autoCloseBalance?: number;
  /**
   * 是否整百提现(位属性)
   */
  boolAttr?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态(1:开启, 0:关闭)
   */
  state: number;
}

export interface RechargeChannelRsp {
  /**
   * 主键ID
   */
  id: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 充值大类ID
   */
  channelCategoryId: number;
  /**
   * 充值通道ID
   */
  channelId: number;
  /**
   * 三方通道编码(tab_thirdpay_tenantchannel.ThirdChannelCode)
   */
  thirdChannelCode: string;
  /**
   * 通道币种(RechargeChannelEntity.SysCurrency)
   */
  sysCurrency: string;
  /**
   * 出款显示名称(tab_thirdpay_tenantchannel.CustomName)
   */
  customName: string;
  /**
   * 三方商户ID
   */
  thirdPayMerchantId: number;
  /**
   * 三方商户号(ThirdPayMerchantEntity.MerchantCode)
   */
  merchantCode: string;
  /**
   * 三方商户状态(1:开启 0:关闭)
   */
  merchantState: number;
  /**
   * 支付厂商编码(用于判断是否内置通道,如SystemBuiltIn)
   */
  payCode: string;
  /**
   * 状态(1:开启, 0:关闭) - tab_thirdpay_tenantchannel.State
   */
  state: number;
  /**
   * 通道状态(1:开启, 0:关闭) - tab_recharge_channel.State
   */
  channelState: number;
  /**
   * 轮询权重
   */
  weight: number;
  /**
   * 实时权重
   */
  realTimeWeight: number;
  /**
   * 成功率统计(预留，后续对接统计表)
   */
  successRateInfo: string;
  /**
   * 近10分钟成功数/总提交数
   */
  recent15MinutesCount: number;
  /**
   * 近30分钟成功数/总提交数
   */
  recent30MinutesCount: number;
  /**
   * 近1小时成功数/总提交数
   */
  recent1HourCount: number;
  /**
   * 当日成功数/总提交数
   */
  recent24HoursCount: number;
  /**
   * 今日已处理数
   */
  todayProcessedCount: number;
  /**
   * 总处理数
   */
  totalProcessedCount: number;
  /**
   * 可用开始时间
   */
  allowStartTime: string;
  /**
   * 可用结束时间
   */
  allowEndTime: string;
  /**
   * 最小充值金额
   */
  minAmount: number;
  /**
   * 最大充值金额
   */
  maxAmount: number;
  /**
   * 手续费率
   */
  serviceFeeRate: number;
  /**
   * 自动关闭余额阈值(余额低于此值后自动关闭，0不处理)
   */
  autoCloseBalance: number;
  /**
   * 可见等级（逗号分隔，如 LV1,LV3,LV5）
   */
  allowRechargeLevel: string;
  /**
   * 是否整百提现(位属性)
   */
  boolAttr: number;
  /**
   * 代收测试是否支持UTR
   */
  isSupportUtrTest: boolean;
  /**
   * 备注
   */
  remark: string;
  /**
   * 最后修改人
   */
  lastUpdateMan: string;
  /**
   * 最后修改时间
   */
  lastUpdateTime: number;
}

/**
 * @description: 充值通道分页查询 (Auth) 响应
 * @url: /api/RechargeChannel/GetPageList
 * @name: RechargeChannelRspListPageBaseResponse
 */
export interface RechargeChannelRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: RechargeChannelRsp[];
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总行数
   */
  totalCount: number;
}

export type RechargeChannelRspListPageBaseResponseApiResponse = RechargeChannelRspListPageBaseResponse;

/**
 * @description: 代收测试回调 (Auth) 响应
 * @url: /api/RechargeChannel/TestRechargeNotify
 * @name: RechargeChannelTestNotifyRsp
 */
export interface RechargeChannelTestNotifyRsp {
  /**
   * 原始响应内容
   */
  data: string;
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 模拟回调请求地址（便于调试时识别命中的通道路由）
   */
  requestUrl: string;
  /**
   * 模拟回调请求体（原始 raw body）
   */
  requestBody: string;
  /**
   * 回调处理过程日志（含 headers 解析、签名验证、订单查找等关键步骤）
   */
  requestLog: string;
  /**
   * 回调处理后返回给三方的响应体
   */
  responseBody: string;
  /**
   * 错误日志
   */
  errorLog: string;
}

export type RechargeChannelTestNotifyRspApiResponse = RechargeChannelTestNotifyRsp;

/**
 * @description: 代收测试拉单 (Auth) 响应
 * @url: /api/RechargeChannel/TestRechargeSubmit
 * @name: RechargeChannelTestSubmitRsp
 */
export interface RechargeChannelTestSubmitRsp {
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 是否扫码支付
   */
  scanCodePay: boolean;
  /**
   * 表单提交地址
   */
  formUrl: string;
  /**
   * 表单提交参数
   */
  formBody: any;
  /**
   * 跳转地址
   */
  redirectUrl: string;
  /**
   * 三方订单号
   */
  thirdOrderNo: string;
  /**
   * 请求地址（调用三方 SDK 实际请求地址，便于定位通道配置）
   */
  requestUrl: string;
  /**
   * 请求体（已脱敏 MerchantCode/MerchantKey/PrivateKey/PublicKey）
   */
  requestBody: string;
  /**
   * 调用过程日志（含 SDK 调用日志，已脱敏密钥）
   */
  requestLog: string;
  /**
   * 响应体（SDK 原始响应 JSON）
   */
  responseBody: string;
  /**
   * 响应状态码（HTTP 或 SDK CodeEnum 数值，便于联调）
   */
  responseStatusCode: number;
  /**
   * 错误日志
   */
  errorLog: string;
}

export type RechargeChannelTestSubmitRspApiResponse = RechargeChannelTestSubmitRsp;

/**
 * @description: 代收测试提交UTR (Auth) 响应
 * @url: /api/RechargeChannel/TestUTRSubmit
 * @name: RechargeChannelTestUtrRsp
 */
export interface RechargeChannelTestUtrRsp {
  /**
   * 原始响应内容
   */
  data: string;
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 请求地址（调用三方 SDK 实际请求地址）
   */
  requestUrl: string;
  /**
   * 请求体（已脱敏密钥）
   */
  requestBody: string;
  /**
   * 调用过程日志（含 SDK 调用日志，已脱敏密钥）
   */
  requestLog: string;
  /**
   * 响应体（SDK 原始响应 JSON）
   */
  responseBody: string;
  /**
   * 响应状态码（SDK CodeEnum 数值）
   */
  responseStatusCode: number;
  /**
   * 错误日志
   */
  errorLog: string;
}

export type RechargeChannelTestUtrRspApiResponse = RechargeChannelTestUtrRsp;

/**
 * @description: 新增本地银行卡收款账户 (Auth) 请求
 * @url: /api/RechargeLocalBank/Add
 * @name: RechargeLocalBankCardAddReq
 */
export interface RechargeLocalBankCardAddReq {
  /**
   * 自定义名称
   */
  customName?: string;
  /**
   * 银行名称/钱包类型
   */
  bankName?: string;
  /**
   * 充值等级
   */
  rechargeLevel?: string;
  /**
   * 账号/usdt地址
   */
  accountNo: string;
  /**
   * 持有人
   */
  holderName?: string;
  /**
   * 支行名称
   */
  subBranchName?: string;
  /**
   * IFSCCODE
   */
  ifsccode?: string;
  /**
   * 二维码地址
   */
  qrCodeURL?: string;
  /**
   * 最小充值金额
   */
  minRechargeAmount?: number;
  /**
   * 最大充值金额
   */
  maxRechargeAmount?: number;
  /**
   * 日总限额
   */
  totalLimitAmount?: number;
  /**
   * 日总限笔数
   */
  totalLimitCount?: number;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 权重
   */
  weight?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 删除本地银行卡收款账户 (Auth) 请求
 * @url: /api/RechargeLocalBank/Delete
 * @name: RechargeLocalBankCardDeleteReq
 */
export interface RechargeLocalBankCardDeleteReq {
  /**
   * Id
   */
  id?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取本地银行卡收款账户详情 (Auth) 响应
 * @url: /api/RechargeLocalBank/Get
 * @name: RechargeLocalBankCardDetailRsp
 */
export interface RechargeLocalBankCardDetailRsp {
  /**
   * 主键Id
   */
  id: number;
  /**
   * 商户Id
   */
  tenantId: number;
  /**
   * 充值通道Id
   */
  channelId: number;
  /**
   * 账户名称
   */
  customName: string;
  /**
   * 银行名称/钱包类型
   */
  bankName: string;
  /**
   * 银行编码/USDT类型Id V1 tab_Banks.BankId.ToString()
   */
  bankCode: string;
  /**
   * 状态(0=关闭, 1=启用)
   */
  state: number;
  /**
   * 是否被系统自动关闭
   */
  isClosedBySystem: boolean;
  /**
   * 权重(用于分配排序)
   */
  weight: number;
  /**
   * 充值等级(逗号分隔的等级Id)
   */
  rechargeLevel: string;
  /**
   * 收款账号
   */
  accountNo: string;
  /**
   * 持卡人姓名
   */
  holderName: string;
  /**
   * 支行名称
   */
  subBranchName: string;
  /**
   * IFSC Code(印度银行识别码)
   */
  ifsccode: string;
  /**
   * 收款二维码图片URL
   */
  qrCodeURL: string;
  /**
   * 单笔最小充值金额
   */
  minRechargeAmount: number;
  /**
   * 单笔最大充值金额
   */
  maxRechargeAmount: number;
  /**
   * 每日收款总额上限(0=不限制)
   */
  totalLimitAmount: number;
  /**
   * 每日收款笔数上限(0=不限制)
   */
  totalLimitCount: number;
  /**
   * 当日已收款总额
   */
  currentTotalLimitAmount: number;
  /**
   * 当日已收款笔数
   */
  currentTotalCount: number;
  /**
   * 排序值
   */
  sort: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 上次清零时间(13位时间戳)
   */
  lastClearTime: number;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 创建时间(13位时间戳)
   */
  createTime: number;
  /**
   * 最后修改人
   */
  lastUpdateMan: string;
  /**
   * 最后修改时间(13位时间戳)
   */
  lastUpdateTime: number;
}

export type RechargeLocalBankCardDetailRspApiResponse = RechargeLocalBankCardDetailRsp;

/**
 * @description: 获取本地银行卡收款账户详情 (Auth) 请求
 * @url: /api/RechargeLocalBank/Get
 * @name: RechargeLocalBankCardGetReq
 */
export interface RechargeLocalBankCardGetReq {
  /**
   * Id
   */
  id?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页查询本地银行卡收款账户列表 (Auth) 请求
 * @url: /api/RechargeLocalBank/GetPageList
 * @name: RechargeLocalBankCardListReq
 */
export interface RechargeLocalBankCardListReq {
  /**
   * 银行名称(模糊查询)
   */
  bankName?: string;
  /**
   * 持有人(模糊查询)
   */
  holderName?: string;
  /**
   * 账号(模糊查询)
   */
  accountNo?: string;
  /**
   * 状态(0:关闭 1:开启, null:全部)
   */
  state?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 排序字段
   */
  sortField?: string;
  /**
   * 
   */
  orderBy: OrderByEnum;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

export interface RechargeLocalBankCardListRsp {
  /**
   * 主键Id
   */
  id: number;
  /**
   * 商户Id
   */
  tenantId: number;
  /**
   * 充值通道Id
   */
  channelId: number;
  /**
   * 账户名称
   */
  customName: string;
  /**
   * 银行名称/钱包类型
   */
  bankName: string;
  /**
   * 银行编码/USDT类型Id V1 tab_Banks.BankId.ToString()
   */
  bankCode: string;
  /**
   * 状态(0=关闭, 1=启用)
   */
  state: number;
  /**
   * 是否被系统自动关闭
   */
  isClosedBySystem: boolean;
  /**
   * 权重(用于分配排序)
   */
  weight: number;
  /**
   * 充值等级(逗号分隔的等级Id)
   */
  rechargeLevel: string;
  /**
   * 收款账号
   */
  accountNo: string;
  /**
   * 持卡人姓名
   */
  holderName: string;
  /**
   * 支行名称
   */
  subBranchName: string;
  /**
   * IFSC Code(印度银行识别码)
   */
  ifsccode: string;
  /**
   * 收款二维码图片URL
   */
  qrCodeURL: string;
  /**
   * 单笔最小充值金额
   */
  minRechargeAmount: number;
  /**
   * 单笔最大充值金额
   */
  maxRechargeAmount: number;
  /**
   * 每日收款总额上限(0=不限制)
   */
  totalLimitAmount: number;
  /**
   * 每日收款笔数上限(0=不限制)
   */
  totalLimitCount: number;
  /**
   * 当日已收款总额
   */
  currentTotalLimitAmount: number;
  /**
   * 当日已收款笔数
   */
  currentTotalCount: number;
  /**
   * 排序值
   */
  sort: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 上次清零时间(13位时间戳)
   */
  lastClearTime: number;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 创建时间(13位时间戳)
   */
  createTime: number;
  /**
   * 最后修改人
   */
  lastUpdateMan: string;
  /**
   * 最后修改时间(13位时间戳)
   */
  lastUpdateTime: number;
}

/**
 * @description: 分页查询本地银行卡收款账户列表 (Auth) 响应
 * @url: /api/RechargeLocalBank/GetPageList
 * @name: RechargeLocalBankCardListRspListPageBaseResponse
 */
export interface RechargeLocalBankCardListRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: RechargeLocalBankCardListRsp[];
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总行数
   */
  totalCount: number;
}

export type RechargeLocalBankCardListRspListPageBaseResponseApiResponse = RechargeLocalBankCardListRspListPageBaseResponse;

export interface RechargeLocalBankCardSelectRsp {
  /**
   * 自定义名称
   */
  customName: string;
  /**
   * 收款账号
   */
  accountNo: string;
  /**
   * 
   */
  sysCategoryId: RechargeCategoryEnum;
  /**
   * 
   */
  id: number;
  /**
   * 
   */
  name: string;
}

/**
 * @description: 获取本地银行卡收款账户下拉列表 (Auth) 响应
 * @url: /api/RechargeLocalBank/GetRechargeLocalBankCardList
 * @name: RechargeLocalBankCardSelectRspListApiResponse
 */
export type RechargeLocalBankCardSelectRspListApiResponse = RechargeLocalBankCardSelectRsp[];

/**
 * @description: 变更本地银行卡收款账户状态 (Auth) 请求
 * @url: /api/RechargeLocalBank/UpdateState
 * @name: RechargeLocalBankCardStateReq
 */
export interface RechargeLocalBankCardStateReq {
  /**
   * Id
   */
  id?: number;
  /**
   * 状态(0:关闭 1:开启)
   */
  state?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 编辑本地银行卡收款账户 (Auth) 请求
 * @url: /api/RechargeLocalBank/Update
 * @name: RechargeLocalBankCardUpdateReq
 */
export interface RechargeLocalBankCardUpdateReq {
  /**
   * Id
   */
  id?: number;
  /**
   * 自定义名称
   */
  customName?: string;
  /**
   * 银行名称/钱包类型
   */
  bankName?: string;
  /**
   * 充值等级
   */
  rechargeLevel?: string;
  /**
   * 账号/usdt地址
   */
  accountNo: string;
  /**
   * 持有人
   */
  holderName?: string;
  /**
   * 支行名称
   */
  subBranchName?: string;
  /**
   * IFSCCODE
   */
  ifsccode?: string;
  /**
   * 二维码地址
   */
  qrCodeURL?: string;
  /**
   * 最小充值金额
   */
  minRechargeAmount?: number;
  /**
   * 最大充值金额
   */
  maxRechargeAmount?: number;
  /**
   * 日总限额
   */
  totalLimitAmount?: number;
  /**
   * 日总限笔数
   */
  totalLimitCount?: number;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 权重
   */
  weight?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取本地待入款分页列表 (Auth) 请求
 * @url: /api/RechargeOrder/GetPageListLocalPending
 * @name: RechargeLocalPendingPageReq
 */
export interface RechargeLocalPendingPageReq {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 充值大类
   */
  rechargeCategoryId?: number;
  /**
   * 收款账号
   */
  receiveAccountNo?: string;
  /**
   * 客户入款账号
   */
  customAccountNo?: string;
  /**
   * 交易号
   */
  transactionId?: string;
  /**
   * 会员充值等级
   */
  rechargeLevel?: number;
  /**
   * 下单开始时间
   */
  startTime?: number;
  /**
   * 下单结束时间
   */
  endTime?: number;
  /**
   * 默认按下单时间倒序
   */
  sortField?: string;
  /**
   * 
   */
  orderBy?: OrderByEnum;
  /**
   * 商户Id
   */
  tenantId?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

/**
 * @description: 新增本地USDT收款账户(双写V1+V3)
USDT独立请求类，不含 minRechargeAmount/maxRechargeAmount/totalLimitAmount/totalLimitCount (Auth) 请求
 * @url: /api/RechargeLocalUsdt/Add
 * @name: RechargeLocalUsdtAddReq
 */
export interface RechargeLocalUsdtAddReq {
  /**
   * 自定义名称
   */
  customName?: string;
  /**
   * USDT类型主键(tab_Banks.BankId字符串)
   */
  bankCode?: string;
  /**
   * 充值等级
   */
  rechargeLevel?: string;
  /**
   * USDT地址
   */
  accountNo: string;
  /**
   * 持有人
   */
  holderName?: string;
  /**
   * 支行名称
   */
  subBranchName?: string;
  /**
   * IFSCCODE
   */
  ifsccode?: string;
  /**
   * 二维码地址
   */
  qrCodeURL?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 权重
   */
  weight?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 编辑本地USDT收款账户(双写V1+V3)
USDT独立请求类，不含 minRechargeAmount/maxRechargeAmount/totalLimitAmount/totalLimitCount (Auth) 请求
 * @url: /api/RechargeLocalUsdt/Update
 * @name: RechargeLocalUsdtUpdateReq
 */
export interface RechargeLocalUsdtUpdateReq {
  /**
   * Id
   */
  id?: number;
  /**
   * 自定义名称
   */
  customName?: string;
  /**
   * USDT类型主键(tab_Banks.BankId字符串)
   */
  bankCode?: string;
  /**
   * 充值等级
   */
  rechargeLevel?: string;
  /**
   * USDT地址
   */
  accountNo: string;
  /**
   * 持有人
   */
  holderName?: string;
  /**
   * 支行名称
   */
  subBranchName?: string;
  /**
   * IFSCCODE
   */
  ifsccode?: string;
  /**
   * 二维码地址
   */
  qrCodeURL?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 权重
   */
  weight?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface RechargeOrderListRsp {
  /**
   * 
   */
  orderNo: string;
  /**
   * 
   */
  userId: number;
  /**
   * 
   */
  userType: number;
  /**
   * 
   */
  rechargeLevel: number;
  /**
   * 
   */
  vipLevel: number;
  /**
   * 
   */
  userState: boolean;
  /**
   * 
   */
  tenantCategoryId: number;
  /**
   * 
   */
  sysCategoryId: RechargeCategoryEnum;
  /**
   * 
   */
  sysChannelId: number;
  /**
   * 
   */
  rechargeCategoryName: string;
  /**
   * 
   */
  rechargeChannelName: string;
  /**
   * 
   */
  thirdPayMerchantId: number;
  /**
   * 
   */
  thirdPayMerchantName: string;
  /**
   * 
   */
  tenantChannelId: number;
  /**
   * 
   */
  receiveInfo: string;
  /**
   * 
   */
  customerInfo: string;
  /**
   * 
   */
  customAccountName: string;
  /**
   * 
   */
  customAccountNo: string;
  /**
   * 
   */
  receiveAccountNo: string;
  /**
   * 
   */
  localBankCardId: number;
  /**
   * 
   */
  amount: number;
  /**
   * 
   */
  actualAmount: number;
  /**
   * 
   */
  giftAmount: number;
  /**
   * 
   */
  uGold: number;
  /**
   * 
   */
  uRate: number;
  /**
   * 
   */
  rechargeState: RechargeState;
  /**
   * 
   */
  remark: string;
  /**
   * 
   */
  certificates: string;
  /**
   * 
   */
  transactionId: string;
  /**
   * 
   */
  expiredTime: number;
  /**
   * 
   */
  sysCurrency: string;
  /**
   * 
   */
  creator: string;
  /**
   * 
   */
  createTime: number;
  /**
   * 
   */
  lastUpdateMan: string;
  /**
   * 
   */
  lastUpdateTime: number;
  /**
   * 
   */
  parentId: number;
  /**
   * 
   */
  generalAgentId: number;
  /**
   * 
   */
  discountType: number;
  /**
   * 
   */
  successTime: number;
  /**
   * 
   */
  refId: number;
  /**
   * 
   */
  refOrderNo: string;
  /**
   * 
   */
  payUrl: string;
  /**
   * 
   */
  arOrderStatus: number;
  /**
   * 
   */
  rechargeCount: number;
  /**
   * 
   */
  userRegisterTime: number;
}

/**
 * @description: 获取三方待入款分页列表 (Auth) 响应
 * @url: /api/RechargeOrder/GetPageListThirdPending
 * @name: RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse
 */
export interface RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: RechargeOrderListRsp[];
  /**
   * 
   */
  summary: RechargeOrderSummaryRsp;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总行数
   */
  totalCount: number;
}

export type RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponseApiResponse = RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse;

export interface RechargeOrderSummaryRsp {
  /**
   * 
   */
  totalOrderCount: number;
  /**
   * 
   */
  totalAmount: number;
  /**
   * 
   */
  totalActualAmount: number;
  /**
   * 
   */
  totalGiftAmount: number;
  /**
   * 
   */
  totalAddedAmount: number;
  /**
   * 
   */
  totalUGold: number;
}

/**
 * @description: 获取入款记录分页列表 (Auth) 请求
 * @url: /api/RechargeOrder/GetPageListRechargeRecord
 * @name: RechargeRecordPageReq
 */
export interface RechargeRecordPageReq {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 充值大类
   */
  rechargeCategoryId?: number;
  /**
   * 充值通道ID
   */
  rechargeChannelId?: number;
  /**
   * 收款账号
   */
  receiveAccountNo?: string;
  /**
   * 客户入款账号
   */
  customAccountNo?: string;
  /**
   * 交易号
   */
  transactionId?: string;
  /**
   * 会员充值等级
   */
  rechargeLevel?: number;
  /**
   * 
   */
  rechargeState?: RechargeState;
  /**
   * 最小发起金额
   */
  minAmount?: number;
  /**
   * 最大发起金额
   */
  maxAmount?: number;
  /**
   * 最小充值次数
   */
  minRechargeTimes?: number;
  /**
   * 最大充值次数
   */
  maxRechargeTimes?: number;
  /**
   * 下单开始时间
   */
  orderStartTime?: number;
  /**
   * 下单结束时间
   */
  orderEndTime?: number;
  /**
   * 完成开始时间
   */
  orderFinishStartTime?: number;
  /**
   * 完成结束时间
   */
  orderFinishEndTime?: number;
  /**
   * 默认按下单时间倒序
   */
  sortField?: string;
  /**
   * 
   */
  orderBy?: OrderByEnum;
  /**
   * 商户Id
   */
  tenantId?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

/**
 * @description: 0 - 待支付 1 - 已支付 2 - 已取消
 */
export type RechargeState = 0 | 1 | 2;

/**
 * @description: 获取三方待入款分页列表 (Auth) 请求
 * @url: /api/RechargeOrder/GetPageListThirdPending
 * @name: RechargeThirdPendingPageReq
 */
export interface RechargeThirdPendingPageReq {
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 充值通道ID
   */
  rechargeChannelId?: number;
  /**
   * 下单开始时间
   */
  startTime?: number;
  /**
   * 下单结束时间
   */
  endTime?: number;
  /**
   * 默认按下单时间倒序
   */
  sortField?: string;
  /**
   * 
   */
  orderBy?: OrderByEnum;
  /**
   * 商户Id
   */
  tenantId?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

export interface RechargeWithdrawChannelRsp {
  /**
   * 租户通道ID
   */
  channelId: number;
  /**
   * 通道字典ID
   */
  sysChannelId: number;
  /**
   * 通道类型
   */
  channelType: string;
  /**
   * 通道名称
   */
  channelNameWithId: string;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 通道最后修改人
   */
  lastUpdateMan: string;
  /**
   * 通道最后修改时间
   */
  lastUpdateTime: number;
}

/**
 * @description: 获取新增场景的三方映射码下拉数据 (Auth) 响应
 * @url: /api/ThirdPayMerchant/GetPayCodeSelectData
 * @name: StringListApiResponse
 */
export type StringListApiResponse = string[];

/**
 * @description: 代收测试回调 (Auth) 请求
 * @url: /api/RechargeChannel/TestRechargeNotify
 * @name: TestRechargeNotifyReq
 */
export interface TestRechargeNotifyReq {
  /**
   * 商户通道ID
   */
  tenantChannelId: number;
  /**
   * 原始回调参数
   */
  notifyBody: string;
  /**
   * 原始请求头JSON
   */
  notifyHeadersJson?: string;
  /**
   * 商户ID
   */
  tenantId: number;
}

/**
 * @description: 代收测试拉单 (Auth) 请求
 * @url: /api/RechargeChannel/TestRechargeSubmit
 * @name: TestRechargeSubmitReq
 */
export interface TestRechargeSubmitReq {
  /**
   * 商户通道ID
   */
  tenantChannelId: number;
  /**
   * 测试金额
   */
  amount: number;
  /**
   * 商户ID
   */
  tenantId: number;
}

/**
 * @description: 代收测试提交UTR (Auth) 请求
 * @url: /api/RechargeChannel/TestUTRSubmit
 * @name: TestUtrSubmitReq
 */
export interface TestUtrSubmitReq {
  /**
   * 充值订单号
   */
  orderNo: string;
  /**
   * UTR号码
   */
  utrNo: string;
  /**
   * 商户ID
   */
  tenantId: number;
}

/**
 * @description: 获取支代付三方商户详情 (Auth) 响应
 * @url: /api/ThirdPayMerchant/GetByPrimaryKey
 * @name: ThirdPayMerchantDetailRsp
 */
export interface ThirdPayMerchantDetailRsp {
  /**
   * ID
   */
  id: number;
  /**
   * 三方映射码
   */
  payCode: string;
  /**
   * 用户自定义名称
   */
  customName: string;
  /**
   * 三方商户号
   */
  merchantCode: string;
  /**
   * 三方商户密钥
   */
  merchantKey: string;
  /**
   * 三方商户密钥掩码
   */
  merchantKeyMask: string;
  /**
   * 公钥
   */
  publicKey: string;
  /**
   * 公钥掩码
   */
  publicKeyMask: string;
  /**
   * 私钥
   */
  privateKey: string;
  /**
   * 私钥掩码
   */
  privateKeyMask: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 币种（从三方支付厂商编码字典获取）
   */
  sysCurrency: string;
}

export type ThirdPayMerchantDetailRspApiResponse = ThirdPayMerchantDetailRsp;

/**
 * @description: 支代付三方商户分页查询 (Auth) 请求
 * @url: /api/ThirdPayMerchant/GetPageList
 * @name: ThirdPayMerchantListReq
 */
export interface ThirdPayMerchantListReq {
  /**
   * 三方映射码
   */
  payCode?: string;
  /**
   * 用户自定义名称
   */
  customName?: string;
  /**
   * 三方商户号
   */
  merchantCode?: string;
  /**
   * 关联商户
   */
  thirdPayMerchantRelation?: string;
  /**
   * 
   */
  state?: EnableEnum;
  /**
   * 币种（选填，从tab_thirdpay_codedictionary按PayCode关联筛选）
   */
  sysCurrency?: string;
  /**
   * 三方余额区间-最小值
   */
  balanceRangeMin?: number;
  /**
   * 三方余额区间-最大值
   */
  balanceRangeMax?: number;
  /**
   * 每页数据量大小
   */
  pageSize: number;
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 排序字段
   */
  sortField?: string;
  /**
   * 
   */
  orderBy: OrderByEnum;
  /**
   * 是否导出
   */
  isExport?: boolean;
  /**
   * 导出文件名
   */
  exportFileName?: string;
  /**
   * 导出时区 EX：9/-9
   */
  exportTimeZone?: number;
  /**
   * 导出列名
   */
  exportTitle?: Record<string, string>;
  /**
   * 字段名翻译
   */
  fieldTranslate?: { AccountNo: string; Name: string; TransactionId: string; UPIAccount: string; BankName: string; HolderName: string; BankCode: string; IFSCCode: string; WalletType: string; RealName: string; USDTAddressNickName: string; USDTType: string; USDTAddress: string };
}

/**
 * @description: 新增支代付三方商户 (Auth) 请求
 * @url: /api/ThirdPayMerchant/Add
 * @name: ThirdPayMerchantModelReq
 */
export interface ThirdPayMerchantModelReq {
  /**
   * 主键
   */
  id?: number;
  /**
   * 集团商户币种
   */
  sysCurrency: string;
  /**
   * 三方映射码
   */
  payCode: string;
  /**
   * 用户自定义名称
   */
  customName: string;
  /**
   * 三方商户号
   */
  merchantCode?: string;
  /**
   * 三方商户密钥
   */
  merchantKey?: string;
  /**
   * 公钥
   */
  publicKey?: string;
  /**
   * 私钥
   */
  privateKey?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态 0=禁用 1=启用
   */
  state: number;
}

export interface ThirdPayMerchantRelationRsp {
  /**
   * 商户Id
   */
  tenantId: number;
  /**
   * 商户，商户名称(商户Id)
   */
  tenantNameWithId: string;
  /**
   * 关联充提通道
   */
  rechargeWithdrawChannelList: RechargeWithdrawChannelRsp[];
}

/**
 * @description: 获取支代付三方商户详情 (Auth) 请求
 * @url: /api/ThirdPayMerchant/GetByPrimaryKey
 * @name: ThirdPayMerchantReq
 */
export interface ThirdPayMerchantReq {
  /**
   * Id
   */
  id: number;
}

export interface ThirdPayMerchantRsp {
  /**
   * Id
   */
  id: number;
  /**
   * 三方映射码
   */
  payCode: string;
  /**
   * 币种（从三方支付厂商编码字典获取）
   */
  sysCurrency: string;
  /**
   * 用户自定义名称
   */
  customName: string;
  /**
   * 三方商户号
   */
  merchantCode: string;
  /**
   * 公钥（掩码显示，仅前2个字符）
   */
  publicKeyMask: string;
  /**
   * 关联商户拼接名称
   */
  tenantNameWithId: string;
  /**
   * 关联商户列表
   */
  thirdPayMerchantRelationList: ThirdPayMerchantRelationRsp[];
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 创建人
   */
  creator: string;
  /**
   * 最后操作人
   */
  lastUpdateMan: string;
  /**
   * 最后操作时间
   */
  lastUpdateTime: number;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 商户余额
   */
  balance: number;
  /**
   * 余额最后查询时间
   */
  balanceUpdateTime: number;
}

/**
 * @description: 支代付三方商户分页查询 (Auth) 响应
 * @url: /api/ThirdPayMerchant/GetPageList
 * @name: ThirdPayMerchantRspListPageBaseResponse
 */
export interface ThirdPayMerchantRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: ThirdPayMerchantRsp[];
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总行数
   */
  totalCount: number;
}

export type ThirdPayMerchantRspListPageBaseResponseApiResponse = ThirdPayMerchantRspListPageBaseResponse;

/**
 * @description: 修改充值通道状态 (Auth) 请求
 * @url: /api/RechargeChannel/UpdateState
 * @name: UpdateStateReq
 */
export interface UpdateStateReq {
  /**
   * 状态 1=启用 0=禁用
   */
  state: number;
  /**
   * 主键
   */
  id: number;
}

