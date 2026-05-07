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
 * @description: 修改会员密码 (Auth) 响应
 * @url: /api/v1/Users/EditUserpwdSubmit
 * @name: ApiResponse
 */
export interface ApiResponse<T = any> {
  data: T;
  code: number;
}

export interface BatchRechargeItemModel {
  /**
   * 行号
   */
  rId?: number;
  /**
   * 旧模板兼容字段，当前批量充值不再使用
   */
  accountType?: string;
  /**
   * 用户ID（字符串，Excel 原样读取）
   */
  userId?: string;
  /**
   * 充值金额（字符串，Excel 原样读取）
   */
  amount?: string;
  /**
   * 充值类型：彩金充值 | 人工充值 | USDT充值 | 人工提款 | 彩金扣除 | 提现退回
   */
  payType?: string;
  /**
   * 打码量倍数
   */
  amountofCode?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 校验错误信息（分号分隔多项错误；为空表示校验通过）
   */
  importInfo?: string;
  /**
   * 执行状态（执行成功 / 执行失败）
   */
  status?: string;
}

/**
 * @description: 分页获取棋牌游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Chess:Export 按钮权限） (Auth) 请求
 * @url: /api/v1/ThirdGame/GetChessGamesBetRecordPageList
 * @name: ChessGamesBetRecordReq
 */
export interface ChessGamesBetRecordReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 游戏厂商编码
   */
  vendorCode?: string;
  /**
   * 子游戏编码
   */
  gameCode?: string;
  /**
   * 注单编号
   */
  orderNo?: string;
  /**
   * 订单状态 0=未结算 1=已结算 2=已取消，null=全部
   */
  orderStatus?: number;
  /**
   * 
   */
  timeType?: OrderTimeTypeEnum;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值
   */
  betAmountMin?: number;
  /**
   * 投注金额最大值
   */
  betAmountMax?: number;
  /**
   * 盈亏金额最小值
   */
  winLossAmountMin?: number;
  /**
   * 盈亏金额最大值
   */
  winLossAmountMax?: number;
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

export interface ChessGamesBetRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 注单编号
   */
  orderNo: string;
  /**
   * 游戏局号
   */
  round: string;
  /**
   * 桌号
   */
  tableNo: string;
  /**
   * 游戏厂商编码
   */
  vendorCode: string;
  /**
   * 游戏厂商名称
   */
  vendorName: string;
  /**
   * 游戏名称
   */
  gameName: string;
  /**
   * 投注金额
   */
  betAmount: number;
  /**
   * 有效投注金额
   */
  validBetAmount: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 盈亏金额
   */
  winLossAmount: number;
  /**
   * 税收金额
   */
  serviceFeeAmount: number;
  /**
   * 订单状态 0=未结算 1=已结算 2=已取消
   */
  orderStatus: number;
  /**
   * 订单状态描述
   */
  orderStatusName: string;
  /**
   * 下注内容
   */
  betContent: string;
  /**
   * 下注时间
   */
  betTime: Date;
  /**
   * 结算时间
   */
  settlementTime: Date;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * 投注IP
   */
  betIP: string;
  /**
   * 注单版本号
   */
  versionKey: string;
}

/**
 * @description: 分页获取棋牌游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Chess:Export 按钮权限） (Auth) 响应
 * @url: /api/v1/ThirdGame/GetChessGamesBetRecordPageList
 * @name: ChessGamesBetRecordRspListChessGamesBetRecordSummaryRspPageBaseResponse
 */
export interface ChessGamesBetRecordRspListChessGamesBetRecordSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: ChessGamesBetRecordRsp[];
  /**
   * 
   */
  summary: ChessGamesBetRecordSummaryRsp;
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

export type ChessGamesBetRecordRspListChessGamesBetRecordSummaryRspPageBaseResponseApiResponse = ChessGamesBetRecordRspListChessGamesBetRecordSummaryRspPageBaseResponse;

export interface ChessGamesBetRecordSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  betAmountSum: number;
  /**
   * 有效投注总额（所有记录）
   */
  validBetAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winAmountSum: number;
  /**
   * 盈亏总额（所有记录）
   */
  winLossAmountSum: number;
  /**
   * 税收总额（所有记录）
   */
  serviceFeeAmountSum: number;
  /**
   * 当前页投注总额
   */
  pageBetAmountSum: number;
  /**
   * 当前页有效投注总额
   */
  pageValidBetAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinAmountSum: number;
  /**
   * 当前页盈亏总额
   */
  pageWinLossAmountSum: number;
  /**
   * 当前页税收总额
   */
  pageServiceFeeAmountSum: number;
}

export interface CodeNameRsp {
  /**
   * 
   */
  code: string;
  /**
   * 
   */
  name: string;
}

/**
 * @description: 获取渠道列表（来自 tab_Channels，按商户ID查询） (Auth) 响应
 * @url: /api/v1/Common/GetChannelList
 * @name: CodeNameRspListApiResponse
 */
export type CodeNameRspListApiResponse = CodeNameRsp[];

/**
 * @description: 获取公共字典映射 (Auth) 响应
 * @url: /api/v1/Common/GetDictionary
 * @name: DictionaryRsp
 */
export interface DictionaryRsp {
  /**
   * 返佣模式
0:正常 1:锁定 2:特设
   */
  rebateMode: IdNameRsp[];
  /**
   * 阿里云OSS文件业务类型
   */
  ossFileTypeEnum: KeyValueRsp[];
  /**
   * 短信配置
   */
  smsConfigList: CodeNameRsp[];
  /**
   * UPI类型列表
   */
  upiList: CodeNameRsp[];
  /**
   * 账变类型
   */
  financialTypeList: CodeNameRsp[];
  /**
   * 注单状态
   */
  orderStatusList: IdNameRsp[];
  /**
   * 体育游戏订单状态 -1=全部 0=未结算 1=已结算 2=下注中 3=未知 4=退款 5=已取消 6=作废 7=提前结算
   */
  sportGamesOrderStatusList: CodeNameRsp[];
  /**
   * 注单排序类型
   */
  orderOrderByTypeList: IdNameRsp[];
  /**
   * 彩票注单状态 0=未压中 1=已压中 2=待开奖 3=开奖中
   */
  gameOrderStateList: CodeNameRsp[];
  /**
   * Win游戏下注类型 0=颜色 1=数字 2=大小
   */
  gameTypeWinList: CodeNameRsp[];
  /**
   * 5D游戏下注类型
   */
  gameType5DList: CodeNameRsp[];
  /**
   * K3游戏下注类型
   */
  gameTypeK3List: CodeNameRsp[];
  /**
   * 极速XOSO订单状态 1=待开奖 2=未中奖 3=已中奖
   */
  fXosoOrderStatusList: CodeNameRsp[];
  /**
   * XOSO玩法父节点类型
   */
  xosoTypeParentList: CodeNameRsp[];
  /**
   * XOSO投注类型列表（按玩法父节点分组，前端根据LotteryType过滤）
   */
  xosoBettingTypeList: XosoBettingTypeRsp[];
  /**
   * 注册设备类型 0=PC 1=Android 2=IOS 3=未知
   */
  phoneTypeList: CodeNameRsp[];
  /**
   * 用户状态 0=禁用 1=启用
   */
  userStateList: CodeNameRsp[];
  /**
   * 代理类型 0=未开通 1=外部代理 2=内部代理
   */
  agentTypeList: CodeNameRsp[];
  /**
   * 黑名单状态 0=正常 1=拉黑
   */
  blockStateList: CodeNameRsp[];
  /**
   * 用户列表排序方式
   */
  userOrderByList: CodeNameRsp[];
  /**
   * 会员层级列表（绝对层级 0级-50级）
   */
  userRelativeLevelList: CodeNameRsp[];
  /**
   * 充值金额排序方式（会员层级页面）
   */
  userRelativeOrderList: CodeNameRsp[];
  /**
   * 下级会员层级列表（相对层级 1级-29级）
   */
  subsetUserLevelList: CodeNameRsp[];
  /**
   * 下级会员排序方式
   */
  subsetUserOrderList: CodeNameRsp[];
  /**
   * 日志类型 1=登录日志 2=操作日志
   */
  logTypeList: CodeNameRsp[];
  /**
   * 日志状态 0=失败 1=成功
   */
  logStateList: CodeNameRsp[];
  /**
   * 网银短信匹配状态 0=匹配失败 1=匹配成功 2=匹配超时 3=等待匹配
   */
  onlineBankingStateList: CodeNameRsp[];
  /**
   * 人工充值审核记录审核状态 0=审核中 1=通过 2=拒绝
   */
  manualRechargeRecordStateList: IdNameRsp[];
  /**
   * 人工充值权限操作类型二级联动数据
   */
  manualRechargeTypeList: IdNameTreeRsp[];
  /**
   * 人工充值权限配置类型 1=操作 2=审核
   */
  manualRechargePermissionTypeList: CodeNameRsp[];
  /**
   * 人工充值权限配置状态 0=关闭 1=开启 2=未配置
   */
  manualRechargePermissionStateList: CodeNameRsp[];
  /**
   * 查询时间类型 BetTime=下注时间 SettleTime=结算时间
   */
  queryTimeTypeList: CodeNameRsp[];
}

export type DictionaryRspApiResponse = DictionaryRsp;

/**
 * @description: 修改会员密码 (Auth) 请求
 * @url: /api/v1/Users/EditUserpwdSubmit
 * @name: EditUserPwdReq
 */
export interface EditUserPwdReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 新密码
   */
  newPwd?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页获取电子游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Electronic:Export 按钮权限） (Auth) 请求
 * @url: /api/v1/ThirdGame/GetElectronicGamesBetRecordPageList
 * @name: ElectronicGamesBetRecordReq
 */
export interface ElectronicGamesBetRecordReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 游戏厂商编码
   */
  vendorCode?: string;
  /**
   * 子游戏编码
   */
  gameCode?: string;
  /**
   * 注单编号
   */
  orderNo?: string;
  /**
   * 订单状态 0=未结算 1=已结算 2=已取消，null=全部
   */
  orderStatus?: number;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值
   */
  betAmountMin?: number;
  /**
   * 投注金额最大值
   */
  betAmountMax?: number;
  /**
   * 盈亏金额最小值
   */
  winLossAmountMin?: number;
  /**
   * 盈亏金额最大值
   */
  winLossAmountMax?: number;
  /**
   * 查询时间类型：0=下注时间（BetTime），1=结算时间（SettleTime），null=默认结算时间
   */
  timeType?: number;
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

export interface ElectronicGamesBetRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 注单编号
   */
  orderNo: string;
  /**
   * 游戏局号
   */
  round: string;
  /**
   * 游戏厂商编码
   */
  vendorCode: string;
  /**
   * 游戏厂商名称
   */
  vendorName: string;
  /**
   * 游戏名称
   */
  gameName: string;
  /**
   * 投注金额
   */
  betAmount: number;
  /**
   * 有效投注金额
   */
  validBetAmount: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 盈亏金额
   */
  winLossAmount: number;
  /**
   * 订单状态 0=未结算 1=已结算 2=已取消
   */
  orderStatus: number;
  /**
   * 订单状态描述
   */
  orderStatusName: string;
  /**
   * 下注内容
   */
  betContent: string;
  /**
   * 下注时间
   */
  betTime: Date;
  /**
   * 结算时间
   */
  settlementTime: Date;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * 投注IP
   */
  betIP: string;
}

/**
 * @description: 分页获取电子游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Electronic:Export 按钮权限） (Auth) 响应
 * @url: /api/v1/ThirdGame/GetElectronicGamesBetRecordPageList
 * @name: ElectronicGamesBetRecordRspListElectronicGamesBetRecordSummaryRspPageBaseResponse
 */
export interface ElectronicGamesBetRecordRspListElectronicGamesBetRecordSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: ElectronicGamesBetRecordRsp[];
  /**
   * 
   */
  summary: ElectronicGamesBetRecordSummaryRsp;
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

export type ElectronicGamesBetRecordRspListElectronicGamesBetRecordSummaryRspPageBaseResponseApiResponse = ElectronicGamesBetRecordRspListElectronicGamesBetRecordSummaryRspPageBaseResponse;

export interface ElectronicGamesBetRecordSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  betAmountSum: number;
  /**
   * 有效投注总额（所有记录）
   */
  validBetAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winAmountSum: number;
  /**
   * 盈亏总额（所有记录）
   */
  winLossAmountSum: number;
  /**
   * 当前页投注总额
   */
  pageBetAmountSum: number;
  /**
   * 当前页有效投注总额
   */
  pageValidBetAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinAmountSum: number;
  /**
   * 当前页盈亏总额
   */
  pageWinLossAmountSum: number;
}

/**
 * @description: 0 - 禁用 1 - 启用
 */
export type EnableEnum = 0 | 1;

/**
 * @description: 分页获取极速XOSO投注记录 (Auth) 请求
 * @url: /api/v1/GameManage/GetFXosoGameBettingPageList
 * @name: FXosoGameBettingReq
 */
export interface FXosoGameBettingReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 订单号
   */
  orderNo?: string;
  /**
   * 期号
   */
  issueNo?: string;
  /**
   * 游戏类型ID（49=北部75秒 50=中部75秒 51=南部45秒）
   */
  typeId?: number;
  /**
   * 订单状态（对应 FXosoOrderStatusEnum）1=待开奖 2=未中奖 3=已中奖，null=全部
   */
  status?: number;
  /**
   * 玩法父节点类型（对应 XosoTypeParentEnum），null=全部
   */
  bettingParentType?: number;
  /**
   * 投注类型，null=全部
   */
  bettingType?: number;
  /**
   * 
   */
  timeType?: OrderTimeTypeEnum;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值
   */
  amountMin?: number;
  /**
   * 投注金额最大值
   */
  amountMax?: number;
  /**
   * 盈利金额最小值（平台盈利 = 投注金额 - 中奖金额）
   */
  profitAmountMin?: number;
  /**
   * 盈利金额最大值
   */
  profitAmountMax?: number;
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

export interface FXosoGameBettingRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 期号
   */
  issueNo: string;
  /**
   * 游戏类型ID
   */
  typeId: number;
  /**
   * 玩法父节点类型（对应 XosoTypeParentEnum）
   */
  bettingParentType: number;
  /**
   * 玩法名称
   */
  bettingParentTypeStr: string;
  /**
   * 投注类型
   */
  bettingType: number;
  /**
   * 投注类型名称
   */
  bettingTypeStr: string;
  /**
   * 投注格式
   */
  bettingFormat: number;
  /**
   * 投注格式名称
   */
  bettingFormatStr: string;
  /**
   * 投注内容
   */
  bettingContent: string;
  /**
   * 投注注数
   */
  totalBetting: number;
  /**
   * 投注倍数
   */
  bettingMultiple: number;
  /**
   * 投注金额
   */
  amount: number;
  /**
   * 手续费（状态为4时不计入）
   */
  serviceCharge: number;
  /**
   * 真实投注金额（状态为4时不计入）
   */
  realBettingAmount: number;
  /**
   * 中奖金额
   */
  winningAmount: number;
  /**
   * 平台盈利（已结算时 = 投注金额 - 中奖金额）
   */
  platformAmount: number;
  /**
   * 会员盈亏金额（= WinningAmount - Amount）
   */
  winLossAmount: number;
  /**
   * 订单状态（对应 FXosoOrderStatusEnum）
   */
  status: number;
  /**
   * 订单状态名称
   */
  statusStr: string;
  /**
   * 投注时间
   */
  createTime: Date;
  /**
   * 开奖时间
   */
  openingTime: Date;
}

/**
 * @description: 分页获取极速XOSO投注记录 (Auth) 响应
 * @url: /api/v1/GameManage/GetFXosoGameBettingPageList
 * @name: FXosoGameBettingRspListFXosoGameBettingSummaryRspPageBaseResponse
 */
export interface FXosoGameBettingRspListFXosoGameBettingSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: FXosoGameBettingRsp[];
  /**
   * 
   */
  summary: FXosoGameBettingSummaryRsp;
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

export type FXosoGameBettingRspListFXosoGameBettingSummaryRspPageBaseResponseApiResponse = FXosoGameBettingRspListFXosoGameBettingSummaryRspPageBaseResponse;

export interface FXosoGameBettingSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  amountSum: number;
  /**
   * 手续费总额（所有记录）
   */
  serviceChargeSum: number;
  /**
   * 真实投注总额（所有记录）
   */
  realBettingAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winningAmountSum: number;
  /**
   * 平台盈利总额（所有记录）
   */
  platformAmountSum: number;
  /**
   * 会员盈亏总额（= WinningAmountSum - AmountSum，所有记录）
   */
  winLossAmountSum: number;
  /**
   * 当前页投注总额
   */
  pageAmountSum: number;
  /**
   * 当前页手续费总额
   */
  pageServiceChargeSum: number;
  /**
   * 当前页真实投注总额
   */
  pageRealBettingAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinningAmountSum: number;
  /**
   * 当前页平台盈利总额
   */
  pagePlatformAmountSum: number;
  /**
   * 当前页会员盈亏总额（= PageWinningAmountSum - PageAmountSum）
   */
  pageWinLossAmountSum: number;
}

/**
 * @description: 分页获取账变记录 (Auth) 请求
 * @url: /api/v1/Finance/GetFinanceRecordPageList
 * @name: FinanceRecordReq
 */
export interface FinanceRecordReq {
  /**
   * 会员ID
   */
  userID?: string;
  /**
   * 订单号
   */
  orderNum?: string;
  /**
   * 账变类型（多选，IN 查询）
   */
  type?: number[];
  /**
   * 操作人
   */
  reserved?: string;
  /**
   * 渠道ID
   */
  channelID?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
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

export interface FinanceRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 商户信息
   */
  tenantInfo: string;
  /**
   * 币种
   */
  sysCurrency: string;
  /**
   * 资金明细ID
   */
  finanID: number;
  /**
   * 期号
   */
  issueNumber: string;
  /**
   * 金额
   */
  amount: number;
  /**
   * 添加时间
   */
  addTime: Date;
  /**
   * 添加时间文本（yyyy-MM-dd HH:mm:ss）
   */
  addTimeStr: string;
  /**
   * 账变类型
   */
  type: number;
  /**
   * 账变类型文本（投注、充值、提现等）
   */
  typeName: string;
  /**
   * 用户ID
   */
  userID: number;
  /**
   * 操作人（经过显示逻辑处理）
   */
  reserved: string;
  /**
   * 备注（原始值）
   */
  remark: string;
  /**
   * 备注（经过显示逻辑处理，投注/中奖类型根据订单号前缀替换为游戏名称）
   */
  remarkDisplay: string;
  /**
   * 账变前金额
   */
  beforeAmount: number;
  /**
   * 账变后金额
   */
  backAmount: number;
  /**
   * 订单号
   */
  orderNum: string;
  /**
   * 是否为扣减类型（投注=0, 提现=5, 保险箱本金存入=18, 电子投注=23, C2C提现=109等，金额前显示"-"）
   */
  isDeduct: boolean;
}

/**
 * @description: 分页获取账变记录 (Auth) 响应
 * @url: /api/v1/Finance/GetFinanceRecordPageList
 * @name: FinanceRecordRspListFinanceRecordSummaryRspPageBaseResponse
 */
export interface FinanceRecordRspListFinanceRecordSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: FinanceRecordRsp[];
  /**
   * 
   */
  summary: FinanceRecordSummaryRsp;
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

export type FinanceRecordRspListFinanceRecordSummaryRspPageBaseResponseApiResponse = FinanceRecordRspListFinanceRecordSummaryRspPageBaseResponse;

export interface FinanceRecordSummaryRsp {
  /**
   * 当前页金额合计
   */
  pageSumAmount: number;
  /**
   * 所有金额合计
   */
  amountSum: string;
}

/**
 * @description: 修改账变备注 (Auth) 请求
 * @url: /api/v1/Finance/UpdateRemark
 * @name: FinanceUpdateRemarkReq
 */
export interface FinanceUpdateRemarkReq {
  /**
   * 资金账变ID（必填）
   */
  finanID?: number;
  /**
   * 备注内容
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface GameCategoryVendorRsp {
  /**
   * 厂商编码
   */
  vendorCode: string;
  /**
   * 厂商名称
   */
  vendorName: string;
}

/**
 * @description: 获取游戏大类厂商列表 (Auth) 响应
 * @url: /api/v1/ThirdGame/GetGameCategoryList
 * @name: GameCategoryVendorRspListApiResponse
 */
export type GameCategoryVendorRspListApiResponse = GameCategoryVendorRsp[];

export interface GameListRsp {
  /**
   * 游戏编码
   */
  gameCode: string;
  /**
   * 游戏名称
   */
  gameName: string;
}

/**
 * @description: 获取子游戏列表 (Auth) 响应
 * @url: /api/v1/ThirdGame/GetGameList
 * @name: GameListRspListApiResponse
 */
export type GameListRspListApiResponse = GameListRsp[];

/**
 * @description: 1 - 下注时间 2 - 结算时间
 */
export type GameOrderTimeTypeEnum = 1 | 2;

/**
 * @description: 获取游戏大类厂商列表 (Auth) 请求
 * @url: /api/v1/ThirdGame/GetGameCategoryList
 * @name: GetGameCategoryListReq
 */
export interface GetGameCategoryListReq {
  /**
   * 游戏大类 -1=全部, 0=电子, 1=真人, 2=体育, 3=彩票, 5=捕鱼, 6=小游戏
   */
  category?: number;
  /**
   * 厂商类型 -1=全部, 0=官方, 1=自营
   */
  vendorType?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取子游戏列表 (Auth) 请求
 * @url: /api/v1/ThirdGame/GetGameList
 * @name: GetGameListReq
 */
export interface GetGameListReq {
  /**
   * 厂商编码
   */
  vendorCode?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取人工充值用户信息（含下拉框数据） (Auth) 请求
 * @url: /api/v1/Recharge/GetRechargeUserInfo
 * @name: GetRechargeUserInfoReq
 */
export interface GetRechargeUserInfoReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取人工充值用户信息（含下拉框数据） (Auth) 响应
 * @url: /api/v1/Recharge/GetRechargeUserInfo
 * @name: GetRechargeUserInfoRsp
 */
export interface GetRechargeUserInfoRsp {
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 账号
   */
  userName: string;
  /**
   * 昵称
   */
  nickName: string;
  /**
   * 会员备注
   */
  remark: string;
  /**
   * 账号类型（0=真实用户，1=测试用户）
   */
  userType: number;
  /**
   * 账号类型描述（真实用户 / 测试用户）
   */
  userTypeStr: string;
  /**
   * 余额
   */
  amount: number;
  /**
   * 打码量
   */
  amountOfCode: number;
  /**
   * 会员状态（0=禁用 1=启用）
   */
  userState: number;
  /**
   * 所属分组ID
   */
  groupId: number;
  /**
   * 所属分组名称
   */
  groupName: string;
  /**
   * 今日充值金额（State=1的订单）
   */
  todayRechargeAmount: number;
  /**
   * 今日彩金充值金额（账变Type=13）
   */
  todayBounsRechargeAmount: number;
  /**
   * 存款类型下拉列表（固定选项）
   */
  playTypeSelectList: PlayTypeOptionRsp[];
  /**
   * 打码量下拉列表（第一项为系统全局打码量，其余固定）
   */
  mosaicSelectList: PlayTypeOptionRsp[];
}

export type GetRechargeUserInfoRspApiResponse = GetRechargeUserInfoRsp;

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
 * @description: 获取VIP等级列表（根据商户ID查询对应数据库） (Auth) 响应
 * @url: /api/v1/Users/GetVipLevelList
 * @name: IdNameRspListApiResponse
 */
export type IdNameRspListApiResponse = IdNameRsp[];

export interface IdNameTreeRsp {
  /**
   * 
   */
  list: IdNameRsp[];
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
 * @description: 提交批量充值执行（两阶段提交第二步） (Auth) 请求
 * @url: /api/v1/Recharge/ImportBatchRechargeData
 * @name: ImportBatchRechargeDataReq
 */
export interface ImportBatchRechargeDataReq {
  /**
   * 待执行的充值列表（来自 InitBatchRechargeFile 校验通过后由前端提交）
   */
  items?: BatchRechargeItemModel[];
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 提交批量充值执行（两阶段提交第二步） (Auth) 响应
 * @url: /api/v1/Recharge/ImportBatchRechargeData
 * @name: ImportBatchRechargeDataRsp
 */
export interface ImportBatchRechargeDataRsp {
  /**
   * 执行状态（success / error）
   */
  state: string;
  /**
   * 提示消息
   */
  message: string;
  /**
   * 执行结果列表（成功项在前）
   */
  data: BatchRechargeItemModel[];
  /**
   * 执行失败数量
   */
  num1: number;
  /**
   * 执行成功数量
   */
  num2: number;
}

export type ImportBatchRechargeDataRspApiResponse = ImportBatchRechargeDataRsp;

/**
 * @description: 解析批量充值Excel文件并做格式、权限、限额预校验（两阶段提交第一步） (Auth) 响应
 * @url: /api/v1/Recharge/InitBatchRechargeFile
 * @name: InitBatchRechargeFileRsp
 */
export interface InitBatchRechargeFileRsp {
  /**
   * 解析+校验后的完整列表（错误项在前，通过项在后）
   */
  data: BatchRechargeItemModel[];
  /**
   * 存在校验错误的条目数量
   */
  errNum: number;
}

export type InitBatchRechargeFileRspApiResponse = InitBatchRechargeFileRsp;

export interface KeyValueRsp {
  /**
   * 
   */
  id: string;
  /**
   * 
   */
  name: string;
  /**
   * 
   */
  extType: string;
}

/**
 * @description: 0 - en-English(英语) 1 - id-Indonesian(印度尼西亚语) 2 - vi-Vietnamese(越南语) 3 - pt-Portuguese(葡萄牙语) 4 - th-Thai(泰语) 5 - zh-Chinese(中文简体) 6 - zh-ChineseTW(中文繁体) 7 - my-Burmese(缅甸语) 8 - bn-Bengali(孟加拉语) 9 - hi-Hindi(印地语) 10 - ms-Malay(马来语) 11 - ur-Urdu(巴基斯坦-乌尔都语) 12 - ar-Arabic(阿拉伯语) 13 - ab-Abkhazian(阿布哈兹语) 14 - aa-Afar(阿法尔语) 15 - af-Afrikaans(南非语) 16 - ak-Akan(阿坎语) 17 - sq-Albanian(阿尔巴尼亚语) 18 - am-Amharic(阿姆哈拉语) 19 - an-Aragonese(阿拉贡语) 20 - hy-Armenian(亚美尼亚语) 21 - av-Avaric(阿瓦尔语) 22 - ae-Avestan(阿维斯陀语) 23 - ay-Aymara(艾马拉语巴斯克语) 24 - az-Azerbaijani(阿塞拜疆语) 25 - bm-Bambara(班巴拉语) 26 - ba-Bashkir(巴什基尔语) 27 - eu-Basque(巴斯克语) 28 - be-Belarusian(白俄罗斯语) 29 - bh-Bihari languages(比哈尔语) 30 - bi-Bislama(比斯拉马语) 31 - bs-Bosnian(波斯尼亚语) 32 - br-Breton(布列塔尼语) 33 - bg-Bulgarian(保加利亚语) 34 - ca-Catalan, Valencian(加泰罗尼亚语) 35 - ch-Chamorro(查莫罗语) 36 - ce-Chechen(车臣语) 37 - ny-Chichewa, Chewa, Nyanja(齐切瓦语) 38 - cv-Chuvash(楚瓦什语) 39 - kw-Cornish(康沃尔语) 40 - co-Corsican(科西嘉语) 41 - cr-Cree(克里语) 42 - hr-Croatian(克罗地亚语) 43 - cs-Czech(捷克语) 44 - da-Danish(丹麦语) 45 - dv-Divehi, Dhivehi, Maldivian(迪维希语) 46 - nl-Dutch, Flemish(荷兰语) 47 - dz-Dzongkha(宗喀语) 48 - eo-Esperanto(世界语) 49 - et-Estonian(爱沙尼亚语) 50 - ee-Ewe(埃维语) 51 - fo-Faroese(法罗语) 52 - fj-Fijian(斐济语) 53 - fi-Finnish(芬兰语) 54 - fr-French(法语) 55 - ff-Fulah(富拉语) 56 - gl-Galician(加利西亚语) 57 - ka-Georgian(格鲁吉亚语) 58 - de-German(德语) 59 - el-Greek(希腊语（现代，1453–）) 60 - gn-Guarani(瓜拉尼语) 61 - gu-Gujarati(古吉拉特语) 62 - ht-Haitian, Haitian Creole(海地克里奥尔语) 63 - ha-Hausa(豪萨语) 64 - he-Hebrew(希伯来语) 65 - hz-Herero(赫雷罗语) 66 - ho-Hiri Motu(希里摩图语) 67 - hu-Hungarian(匈牙利语) 68 - ia-Interlingua(国际语) 69 - ie-Interlingue, Occidental(西方国际语) 70 - ga-Irish(爱尔兰语) 71 - ig-Igbo(伊博语) 72 - ik-Inupiaq(因纽皮雅特语) 73 - io-Ido(伊多语) 74 - it-Italian(意大利语) 75 - iu-Inuktitut(伊努克提图特语) 76 - ja-Japanese(日语) 77 - jv-Javanese(爪哇语) 78 - kl-Kalaallisut, Greenlandic(格陵兰语) 79 - kn-Kannada(卡纳达语) 80 - kr-Kanuri(卡努里语) 81 - ks-Kashmiri(克什米尔语) 82 - kk-Kazakh(哈萨克语) 83 - km-Central Khmer(高棉语) 84 - ki-Kikuyu, Gikuyu(基库尤语) 85 - rw-Kinyarwanda(卢旺达语) 86 - ky-Kirghiz, Kyrgyz(柯尔克孜语) 87 - kv-Komi(科米语) 88 - kg-Kongo(刚果语) 89 - ko-Korean(朝鲜语) 90 - ku-Kurdish(库尔德语) 91 - kj-Kuanyama, Kwanyama(宽亚玛语) 92 - la-Latin(拉丁语) 93 - lb-Luxembourgish, Letzeburgesch(卢森堡语) 94 - lg-Ganda(卢干达语) 95 - li-Limburgan, Limburger, Limburgish(林堡语) 96 - ln-Lingala(林加拉语) 97 - lo-Lao(老挝语) 98 - lt-Lithuanian(立陶宛语) 99 - lu-Luba-Katanga(卢巴卡丹加语) 100 - lv-Latvian(拉脱维亚语) 101 - gv-Manx(马恩岛语) 102 - mk-Macedonian(马其顿语) 103 - mg-Malagasy(马达加斯加语) 104 - ml-Malayalam(马拉雅拉姆语) 105 - mt-Maltese(马耳他语) 106 - mi-Maori(毛利语) 107 - mr-Marathi(马拉地语) 108 - mh-Marshallese(马绍尔语) 109 - mn-Mongolian(蒙古语) 110 - na-Nauru(瑙鲁语) 111 - nv-Navajo, Navaho(纳瓦荷语) 112 - nd-North Ndebele(北恩德贝莱语) 113 - ne-Nepali(尼泊尔语) 114 - ng-Ndonga(恩敦加语) 115 - nb-Norwegian Bokmål(书面挪威语) 116 - nn-Norwegian Nynorsk(新挪威语) 117 - no-Norwegian(挪威语) 118 - ii-Sichuan Yi, Nuosu(彝语北部方言) 119 - nr-South Ndebele(南恩德贝莱语) 120 - oc-Occitan(奥克语) 121 - oj-Ojibwa(奥吉布瓦语) 122 - cu-Church Slavic(教会斯拉夫语) 123 - om-Oromo(奥罗莫语) 124 - or-Oriya(奥里亚语) 125 - os-Ossetian, Ossetic(奥塞梯语) 126 - pa-Punjabi, Panjabi(旁遮普语) 127 - pi-Pali(巴利语) 128 - fa-Persian(波斯语) 129 - pl-Polish(波兰语) 130 - ps-Pashto, Pushto(普什图语) 131 - qu-Quechua(克丘亚语) 132 - rm-Romansh(罗曼什语) 133 - rn-Rundi(基隆迪语) 134 - ro-Romanian, Moldavian, Moldovan(罗马尼亚语) 135 - ru-Russian(俄语) 136 - sa-Sanskrit(梵语) 137 - sc-Sardinian(萨丁尼亚语) 138 - sd-Sindhi(信德语) 139 - se-Northern Sami(北萨米语) 140 - sm-Samoan(萨摩亚语) 141 - sg-Sango(桑戈语) 142 - sr-Serbian(塞尔维亚语) 143 - gd-Gaelic,(苏格兰盖尔语) 144 - sn-Shona(绍纳语) 145 - si-Sinhala, Sinhalese(僧伽罗语) 146 - sk-Slovak(斯洛伐克语) 147 - sl-Slovenian(斯洛文尼亚语) 148 - so-Somali(索马里语) 149 - st-Southern Sotho(塞索托语) 150 - es-Spanish, Castilian(西班牙语) 151 - su-Sundanese(巽他语) 152 - sw-Swahili(斯瓦希里语) 153 - ss-Swati(史瓦帝语) 154 - sv-Swedish(瑞典语) 155 - ta-Tamil(泰米尔语) 156 - te-Telugu(泰卢固语) 157 - tg-Tajik(塔吉克语) 158 - ti-Tigrinya(提格利尼亚语) 159 - bo-Tibetan(藏语) 160 - tk-Turkmen(土库曼语) 161 - tl-Tagalog(他加禄语) 162 - tn-Tswana(茨瓦纳语) 163 - to-Tonga(汤加语) 164 - tr-Turkish(土耳其语) 165 - ts-Tsonga(聪加语) 166 - tt-Tatar(鞑靼语) 167 - tw-Twi(契维语) 168 - ty-Tahitian(塔希提语) 169 - ug-Uighur, Uyghur(维吾尔语) 170 - uk-Ukrainian(乌克兰语) 171 - uz-Uzbek(乌孜别克语) 172 - ve-Venda(文达语) 173 - vo-Volapük(沃拉普克语) 174 - wa-Walloon(瓦隆语) 175 - cy-Welsh(威尔士语) 176 - wo-Wolof(沃洛夫语) 177 - fy-West Frisian(弗里斯兰语) 178 - xh-Xhosa(科萨语) 179 - yi-Yiddish(意第绪语) 180 - yo-Yoruba(约鲁巴语) 181 - za-Zhuang, Chuang(壮语) 182 - zu-Zulu(祖鲁语)
 */
export type LanguageEnum = "en-English(英语)" | "id-Indonesian(印度尼西亚语)" | "vi-Vietnamese(越南语)" | "pt-Portuguese(葡萄牙语)" | "th-Thai(泰语)" | "zh-Chinese(中文简体)" | "zh-ChineseTW(中文繁体)" | "my-Burmese(缅甸语)" | "bn-Bengali(孟加拉语)" | "hi-Hindi(印地语)" | "ms-Malay(马来语)" | "ur-Urdu(巴基斯坦-乌尔都语)" | "ar-Arabic(阿拉伯语)" | "ab-Abkhazian(阿布哈兹语)" | "aa-Afar(阿法尔语)" | "af-Afrikaans(南非语)" | "ak-Akan(阿坎语)" | "sq-Albanian(阿尔巴尼亚语)" | "am-Amharic(阿姆哈拉语)" | "an-Aragonese(阿拉贡语)" | "hy-Armenian(亚美尼亚语)" | "av-Avaric(阿瓦尔语)" | "ae-Avestan(阿维斯陀语)" | "ay-Aymara(艾马拉语巴斯克语)" | "az-Azerbaijani(阿塞拜疆语)" | "bm-Bambara(班巴拉语)" | "ba-Bashkir(巴什基尔语)" | "eu-Basque(巴斯克语)" | "be-Belarusian(白俄罗斯语)" | "bh-Bihari languages(比哈尔语)" | "bi-Bislama(比斯拉马语)" | "bs-Bosnian(波斯尼亚语)" | "br-Breton(布列塔尼语)" | "bg-Bulgarian(保加利亚语)" | "ca-Catalan, Valencian(加泰罗尼亚语)" | "ch-Chamorro(查莫罗语)" | "ce-Chechen(车臣语)" | "ny-Chichewa, Chewa, Nyanja(齐切瓦语)" | "cv-Chuvash(楚瓦什语)" | "kw-Cornish(康沃尔语)" | "co-Corsican(科西嘉语)" | "cr-Cree(克里语)" | "hr-Croatian(克罗地亚语)" | "cs-Czech(捷克语)" | "da-Danish(丹麦语)" | "dv-Divehi, Dhivehi, Maldivian(迪维希语)" | "nl-Dutch, Flemish(荷兰语)" | "dz-Dzongkha(宗喀语)" | "eo-Esperanto(世界语)" | "et-Estonian(爱沙尼亚语)" | "ee-Ewe(埃维语)" | "fo-Faroese(法罗语)" | "fj-Fijian(斐济语)" | "fi-Finnish(芬兰语)" | "fr-French(法语)" | "ff-Fulah(富拉语)" | "gl-Galician(加利西亚语)" | "ka-Georgian(格鲁吉亚语)" | "de-German(德语)" | "el-Greek(希腊语（现代，1453–）)" | "gn-Guarani(瓜拉尼语)" | "gu-Gujarati(古吉拉特语)" | "ht-Haitian, Haitian Creole(海地克里奥尔语)" | "ha-Hausa(豪萨语)" | "he-Hebrew(希伯来语)" | "hz-Herero(赫雷罗语)" | "ho-Hiri Motu(希里摩图语)" | "hu-Hungarian(匈牙利语)" | "ia-Interlingua(国际语)" | "ie-Interlingue, Occidental(西方国际语)" | "ga-Irish(爱尔兰语)" | "ig-Igbo(伊博语)" | "ik-Inupiaq(因纽皮雅特语)" | "io-Ido(伊多语)" | "it-Italian(意大利语)" | "iu-Inuktitut(伊努克提图特语)" | "ja-Japanese(日语)" | "jv-Javanese(爪哇语)" | "kl-Kalaallisut, Greenlandic(格陵兰语)" | "kn-Kannada(卡纳达语)" | "kr-Kanuri(卡努里语)" | "ks-Kashmiri(克什米尔语)" | "kk-Kazakh(哈萨克语)" | "km-Central Khmer(高棉语)" | "ki-Kikuyu, Gikuyu(基库尤语)" | "rw-Kinyarwanda(卢旺达语)" | "ky-Kirghiz, Kyrgyz(柯尔克孜语)" | "kv-Komi(科米语)" | "kg-Kongo(刚果语)" | "ko-Korean(朝鲜语)" | "ku-Kurdish(库尔德语)" | "kj-Kuanyama, Kwanyama(宽亚玛语)" | "la-Latin(拉丁语)" | "lb-Luxembourgish, Letzeburgesch(卢森堡语)" | "lg-Ganda(卢干达语)" | "li-Limburgan, Limburger, Limburgish(林堡语)" | "ln-Lingala(林加拉语)" | "lo-Lao(老挝语)" | "lt-Lithuanian(立陶宛语)" | "lu-Luba-Katanga(卢巴卡丹加语)" | "lv-Latvian(拉脱维亚语)" | "gv-Manx(马恩岛语)" | "mk-Macedonian(马其顿语)" | "mg-Malagasy(马达加斯加语)" | "ml-Malayalam(马拉雅拉姆语)" | "mt-Maltese(马耳他语)" | "mi-Maori(毛利语)" | "mr-Marathi(马拉地语)" | "mh-Marshallese(马绍尔语)" | "mn-Mongolian(蒙古语)" | "na-Nauru(瑙鲁语)" | "nv-Navajo, Navaho(纳瓦荷语)" | "nd-North Ndebele(北恩德贝莱语)" | "ne-Nepali(尼泊尔语)" | "ng-Ndonga(恩敦加语)" | "nb-Norwegian Bokmål(书面挪威语)" | "nn-Norwegian Nynorsk(新挪威语)" | "no-Norwegian(挪威语)" | "ii-Sichuan Yi, Nuosu(彝语北部方言)" | "nr-South Ndebele(南恩德贝莱语)" | "oc-Occitan(奥克语)" | "oj-Ojibwa(奥吉布瓦语)" | "cu-Church Slavic(教会斯拉夫语)" | "om-Oromo(奥罗莫语)" | "or-Oriya(奥里亚语)" | "os-Ossetian, Ossetic(奥塞梯语)" | "pa-Punjabi, Panjabi(旁遮普语)" | "pi-Pali(巴利语)" | "fa-Persian(波斯语)" | "pl-Polish(波兰语)" | "ps-Pashto, Pushto(普什图语)" | "qu-Quechua(克丘亚语)" | "rm-Romansh(罗曼什语)" | "rn-Rundi(基隆迪语)" | "ro-Romanian, Moldavian, Moldovan(罗马尼亚语)" | "ru-Russian(俄语)" | "sa-Sanskrit(梵语)" | "sc-Sardinian(萨丁尼亚语)" | "sd-Sindhi(信德语)" | "se-Northern Sami(北萨米语)" | "sm-Samoan(萨摩亚语)" | "sg-Sango(桑戈语)" | "sr-Serbian(塞尔维亚语)" | "gd-Gaelic,(苏格兰盖尔语)" | "sn-Shona(绍纳语)" | "si-Sinhala, Sinhalese(僧伽罗语)" | "sk-Slovak(斯洛伐克语)" | "sl-Slovenian(斯洛文尼亚语)" | "so-Somali(索马里语)" | "st-Southern Sotho(塞索托语)" | "es-Spanish, Castilian(西班牙语)" | "su-Sundanese(巽他语)" | "sw-Swahili(斯瓦希里语)" | "ss-Swati(史瓦帝语)" | "sv-Swedish(瑞典语)" | "ta-Tamil(泰米尔语)" | "te-Telugu(泰卢固语)" | "tg-Tajik(塔吉克语)" | "ti-Tigrinya(提格利尼亚语)" | "bo-Tibetan(藏语)" | "tk-Turkmen(土库曼语)" | "tl-Tagalog(他加禄语)" | "tn-Tswana(茨瓦纳语)" | "to-Tonga(汤加语)" | "tr-Turkish(土耳其语)" | "ts-Tsonga(聪加语)" | "tt-Tatar(鞑靼语)" | "tw-Twi(契维语)" | "ty-Tahitian(塔希提语)" | "ug-Uighur, Uyghur(维吾尔语)" | "uk-Ukrainian(乌克兰语)" | "uz-Uzbek(乌孜别克语)" | "ve-Venda(文达语)" | "vo-Volapük(沃拉普克语)" | "wa-Walloon(瓦隆语)" | "cy-Welsh(威尔士语)" | "wo-Wolof(沃洛夫语)" | "fy-West Frisian(弗里斯兰语)" | "xh-Xhosa(科萨语)" | "yi-Yiddish(意第绪语)" | "yo-Yoruba(约鲁巴语)" | "za-Zhuang, Chuang(壮语)" | "zu-Zulu(祖鲁语)";

/**
 * @description: 分页获取真人视讯投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:LiveGame:Export 按钮权限） (Auth) 请求
 * @url: /api/v1/ThirdGame/GetLiveGamesBetRecordPageList
 * @name: LiveGamesBetRecordReq
 */
export interface LiveGamesBetRecordReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 游戏厂商编码
   */
  vendorCode?: string;
  /**
   * 子游戏编码
   */
  gameCode?: string;
  /**
   * 注单编号
   */
  orderNo?: string;
  /**
   * 游戏局号
   */
  round?: string;
  /**
   * 订单状态 0=未结算 1=已结算 2=已取消，null=全部
   */
  orderStatus?: number;
  /**
   * 
   */
  timeType?: OrderTimeTypeEnum;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值
   */
  betAmountMin?: number;
  /**
   * 投注金额最大值
   */
  betAmountMax?: number;
  /**
   * 盈亏金额最小值
   */
  winLossAmountMin?: number;
  /**
   * 盈亏金额最大值
   */
  winLossAmountMax?: number;
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

export interface LiveGamesBetRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 注单编号
   */
  orderNo: string;
  /**
   * 游戏局号
   */
  round: string;
  /**
   * 游戏厂商编码
   */
  vendorCode: string;
  /**
   * 游戏名称
   */
  gameName: string;
  /**
   * 投注金额
   */
  betAmount: number;
  /**
   * 有效投注金额
   */
  validBetAmount: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 盈亏金额
   */
  winLossAmount: number;
  /**
   * 订单状态 0=未结算 1=已结算 2=已取消
   */
  orderStatus: number;
  /**
   * 订单状态描述
   */
  orderStatusName: string;
  /**
   * 下注内容
   */
  betContent: string;
  /**
   * 下注时间
   */
  betTime: Date;
  /**
   * 结算时间
   */
  settlementTime: Date;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * 投注IP
   */
  betIP: string;
}

/**
 * @description: 分页获取真人视讯投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:LiveGame:Export 按钮权限） (Auth) 响应
 * @url: /api/v1/ThirdGame/GetLiveGamesBetRecordPageList
 * @name: LiveGamesBetRecordRspListLiveGamesBetRecordSummaryRspPageBaseResponse
 */
export interface LiveGamesBetRecordRspListLiveGamesBetRecordSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: LiveGamesBetRecordRsp[];
  /**
   * 
   */
  summary: LiveGamesBetRecordSummaryRsp;
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

export type LiveGamesBetRecordRspListLiveGamesBetRecordSummaryRspPageBaseResponseApiResponse = LiveGamesBetRecordRspListLiveGamesBetRecordSummaryRspPageBaseResponse;

export interface LiveGamesBetRecordSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  betAmountSum: number;
  /**
   * 有效投注总额（所有记录）
   */
  validBetAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winAmountSum: number;
  /**
   * 盈亏总额（所有记录）
   */
  winLossAmountSum: number;
  /**
   * 当前页投注总额
   */
  pageBetAmountSum: number;
  /**
   * 当前页有效投注总额
   */
  pageValidBetAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinAmountSum: number;
  /**
   * 当前页盈亏总额
   */
  pageWinLossAmountSum: number;
}

/**
 * @description: 1 - WinGo 2 - D5 3 - K3 4 - TrxWinGo
 */
export type LotteryGameCategoryEnum = 1 | 2 | 3 | 4;

/**
 * @description: 分页获取彩票游戏投注记录（合并 Win / 5D / K3 / Trx_Win，通过 GameCategory 区分彩种；IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:OldLottoExport 按钮权限） (Auth) 请求
 * @url: /api/v1/GameManage/GetLotteryGameOrderPageList
 * @name: LotteryGameOrderReq
 */
export interface LotteryGameOrderReq {
  /**
   * 
   */
  gameCategory?: LotteryGameCategoryEnum;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 投注订单号
   */
  orderNumber?: string;
  /**
   * 期号
   */
  issueNumber?: string;
  /**
   * 彩种类型ID（游戏期号类型，如1Min/3Min/5Min等）
   */
  typeId?: number;
  /**
   * 注单状态 0=未压中 1=已压中 2=待开奖 3=开奖中，null=全部
   */
  state?: number;
  /**
   * 投注类型
   */
  gameType?: string;
  /**
   * 投注内容
   */
  selectType?: string;
  /**
   * 
   */
  timeType?: GameOrderTimeTypeEnum;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值（大于0的整数）
   */
  amountMin?: number;
  /**
   * 投注金额最大值（大于0的整数）
   */
  amountMax?: number;
  /**
   * 盈亏金额最小值
   */
  winLossAmountMin?: number;
  /**
   * 盈亏金额最大值
   */
  winLossAmountMax?: number;
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

export interface LotteryGameOrderRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 
   */
  tenantInfo: string;
  /**
   * 投注ID
   */
  betID: number;
  /**
   * 投注订单号
   */
  orderNumber: string;
  /**
   * 会员ID
   */
  userID: number;
  /**
   * 期号
   */
  issueNumber: string;
  /**
   * 彩种类型ID
   */
  typeID: number;
  /**
   * 玩法类型名称
   */
  typeIDName: string;
  /**
   * 投注金额
   */
  amount: number;
  /**
   * 投注倍数
   */
  betCount: number;
  /**
   * 投注类型
   */
  gameType: string;
  /**
   * 投注类型名称
   */
  gameTypeName: string;
  /**
   * 投注内容
   */
  selectType: string;
  /**
   * 真实投注金额
   */
  realAmount: number;
  /**
   * 手续费
   */
  serviceCharge: number;
  /**
   * 状态 0=未压中 1=已压中 2=待开奖 3=开奖中
   */
  state: number;
  /**
   * 状态描述
   */
  stateName: string;
  /**
   * 盈利金额
   */
  profitAmount: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 会员盈亏金额（= WinAmount - Amount）
   */
  winLossAmount: number;
  /**
   * 开奖结果
   */
  premium: string;
  /**
   * 尾数（Win/Trx_Win）
   */
  number: string;
  /**
   * 颜色（Win/Trx_Win）
   */
  colour: string;
  /**
   * 下注时间
   */
  addTime: Date;
  /**
   * 结算时间
   */
  settlementTime: Date;
}

/**
 * @description: 分页获取彩票游戏投注记录（合并 Win / 5D / K3 / Trx_Win，通过 GameCategory 区分彩种；IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:OldLottoExport 按钮权限） (Auth) 响应
 * @url: /api/v1/GameManage/GetLotteryGameOrderPageList
 * @name: LotteryGameOrderRspListLotteryGameOrderSummaryRspPageBaseResponse
 */
export interface LotteryGameOrderRspListLotteryGameOrderSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: LotteryGameOrderRsp[];
  /**
   * 
   */
  summary: LotteryGameOrderSummaryRsp;
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

export type LotteryGameOrderRspListLotteryGameOrderSummaryRspPageBaseResponseApiResponse = LotteryGameOrderRspListLotteryGameOrderSummaryRspPageBaseResponse;

export interface LotteryGameOrderSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  amountSum: number;
  /**
   * 投注倍数总计（所有记录）
   */
  betCountSum: number;
  /**
   * 真实投注总额（所有记录）
   */
  realAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winAmountSum: number;
  /**
   * 盈亏总额（所有记录）
   */
  profitAmountSum: number;
  /**
   * 会员盈亏总额（= WinAmountSum - AmountSum，所有记录）
   */
  winLossAmountSum: number;
  /**
   * 手续费总额（= AmountSum - RealAmountSum，所有记录）
   */
  serviceChargeSum: number;
  /**
   * 当前页投注总额
   */
  pageAmountSum: number;
  /**
   * 当前页投注倍数总计
   */
  pageBetCountSum: number;
  /**
   * 当前页真实投注总额
   */
  pageRealAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinAmountSum: number;
  /**
   * 当前页盈亏总额
   */
  pageProfitAmountSum: number;
  /**
   * 当前页会员盈亏总额（= PageWinAmountSum - PageAmountSum）
   */
  pageWinLossAmountSum: number;
  /**
   * 当前页手续费总额（= PageAmountSum - PageRealAmountSum）
   */
  pageServiceChargeSum: number;
}

/**
 * @description: 导出后台操作审核列表（State 固定为审核中） (Auth) 请求
 * @url: /api/v1/Recharge/ExportManualRechargeApprovalList
 * @name: ManualRechargeApprovalListPageReq
 */
export interface ManualRechargeApprovalListPageReq {
  /**
   * 用户ID（为0或null时不过滤）
   */
  userId?: number;
  /**
   * 操作类型（1=人工充值 2=修改银行卡 3=修改会员密码，为-1或null时不过滤）
   */
  type?: number;
  /**
   * 子类型/充提类型（1=人工存款 2=彩金充值 3=USDT充值 4=人工提款 5=彩金扣除 6=退回提现，为0或null时不过滤）
   */
  fundType?: number;
  /**
   * 操作人（模糊匹配）
   */
  creator?: string;
  /**
   * 操作时间开始
   */
  beginCreateTime?: Date;
  /**
   * 操作时间结束
   */
  endCreateTime?: Date;
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

export interface ManualRechargeApprovalListRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 
   */
  id: number;
  /**
   * 账号
   */
  userName: string;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 操作类型原始值（1=人工充值 2=修改银行卡 3=修改会员密码 0=--）
   */
  type: number;
  /**
   * 操作类型显示文本
   */
  typeStr: string;
  /**
   * 充提类型原始值（1=人工存款 2=彩金充值 3=USDT充值 4=人工提款 5=彩金扣除 6=退回提现 0=--）
   */
  fundType: number;
  /**
   * 充提类型显示文本
   */
  fundTypeStr: string;
  /**
   * 操作时间
   */
  createTime: Date;
  /**
   * 操作人
   */
  creator: string;
  /**
   * 操作内容
   */
  content: string;
  /**
   * 是否有审核权限（V3 固定为 true，审核权限通过 CustomAuthCode 控制）
   */
  hasAuditPermission: boolean;
}

/**
 * @description: 分页获取后台操作审核列表 (Auth) 响应
 * @url: /api/v1/Recharge/GetManualRechargeApprovalPageList
 * @name: ManualRechargeApprovalListRspListPageBaseResponse
 */
export interface ManualRechargeApprovalListRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: ManualRechargeApprovalListRsp[];
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

export type ManualRechargeApprovalListRspListPageBaseResponseApiResponse = ManualRechargeApprovalListRspListPageBaseResponse;

/**
 * @description: 人工充值审核通过 (Auth) 请求
 * @url: /api/v1/Recharge/ManualRechargeApprove
 * @name: ManualRechargeApproveReq
 */
export interface ManualRechargeApproveReq {
  /**
   * 审核记录ID列表
   */
  ids?: number[];
  /**
   * 充值金额上限（大于0时，过滤掉充值金额超过此值的记录；为null或0时不过滤）
   */
  maxAmount?: number;
  /**
   * 是否排除相同会员ID（true时，过滤掉同一会员ID出现多次的所有记录）
   */
  excludeDuplicateUserId?: boolean;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface ManualRechargeRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 
   */
  id: number;
  /**
   * 账号
   */
  userName: string;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 充提类型原始值
   */
  fundType: number;
  /**
   * 充提类型显示文本（1=人工存款 2=彩金充值 3=USDT充值 4=人工提款 5=彩金扣除 6=退回提现 0=--）
   */
  fundTypeStr: string;
  /**
   * 存取款金额
   */
  amount: number;
  /**
   * 审核状态原始值（0=审核中 1=通过 2=拒绝）
   */
  state: number;
  /**
   * 操作人
   */
  creator: string;
  /**
   * 操作时间
   */
  createTime: Date;
  /**
   * 审核人
   */
  auditor: string;
  /**
   * 审核人备注
   */
  auditorRemark: string;
  /**
   * 审核时间
   */
  auditTime: Date;
  /**
   * 操作类型原始值（1=人工充值 2=修改银行卡 3=修改会员密码 0=--）
   */
  type: number;
  /**
   * 操作类型显示文本
   */
  typeStr: string;
  /**
   * 操作内容
   */
  content: string;
  /**
   * 操作时间（格式：yyyy-MM-dd HH:mm:ss）
   */
  createTimeStr: string;
  /**
   * 审核时间（格式：yyyy-MM-dd HH:mm:ss，未审核时为空字符串）
   */
  auditTimeStr: string;
}

/**
 * @description: 分页获取人工充值记录（IsExport=true 时导出，需配置 Finance:ManualRecharge:ApprovalRecordPage:Export 按钮权限） (Auth) 响应
 * @url: /api/v1/Recharge/GetManualRechargeRecordsPageList
 * @name: ManualRechargeRecordRspListPageBaseResponse
 */
export interface ManualRechargeRecordRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: ManualRechargeRecordRsp[];
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

export type ManualRechargeRecordRspListPageBaseResponseApiResponse = ManualRechargeRecordRspListPageBaseResponse;

/**
 * @description: 分页获取人工充值记录（IsExport=true 时导出，需配置 Finance:ManualRecharge:ApprovalRecordPage:Export 按钮权限） (Auth) 请求
 * @url: /api/v1/Recharge/GetManualRechargeRecordsPageList
 * @name: ManualRechargeRecordsPageReq
 */
export interface ManualRechargeRecordsPageReq {
  /**
   * 用户ID（为0或null时不过滤）
   */
  userId?: number;
  /**
   * 操作类型（-1=全部 1=人工充值 2=修改银行卡 3=修改会员密码，为-1或null时不过滤）
   */
  type?: number;
  /**
   * 子类型/充提类型（0=全部 1=人工存款 2=彩金充值 3=USDT充值 4=人工提款 5=彩金扣除 6=退回提现，为0或null时不过滤）
   */
  fundType?: number;
  /**
   * 审核状态（-1=全部 0=审核中 1=通过 2=拒绝，为-1或null时不过滤）
   */
  state?: number;
  /**
   * 操作人（模糊匹配）
   */
  creator?: string;
  /**
   * 审核人（模糊匹配）
   */
  auditor?: string;
  /**
   * 充值时间开始
   */
  beginCreateTime?: Date;
  /**
   * 充值时间结束
   */
  endCreateTime?: Date;
  /**
   * 审核时间开始
   */
  beginAuditTime?: Date;
  /**
   * 审核时间结束
   */
  endAuditTime?: Date;
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

/**
 * @description: 人工充值审核拒绝 (Auth) 请求
 * @url: /api/v1/Recharge/ManualRechargeReject
 * @name: ManualRechargeRejectReq
 */
export interface ManualRechargeRejectReq {
  /**
   * 审核记录ID列表
   */
  ids?: number[];
  /**
   * 拒绝备注（最多500字）
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取VIP等级列表（根据商户ID查询对应数据库） (Auth) 请求
 * @url: /api/v1/Users/GetVipLevelList
 * @name: MasterApiRequest
 */
export interface MasterApiRequest {
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取银行卡类型下拉列表（根据商户ID查询对应数据库） (Auth) 请求
 * @url: /api/v1/Users/GetBankTypeList
 * @name: MasterPageBaseRequest
 */
export interface MasterPageBaseRequest {
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

/**
 * @description: 分页获取彩票游戏（NewLottery）投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:NewLottoExport 按钮权限） (Auth) 请求
 * @url: /api/v1/ThirdGame/GetNewLotteryBetRecordPageList
 * @name: NewLotteryBetRecordReq
 */
export interface NewLotteryBetRecordReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 注单编号
   */
  orderNo?: string;
  /**
   * 期号
   */
  issueNumber?: string;
  /**
   * 彩种类型ID（游戏期号类型，对应 tab_NewLottery_Game_Type.TypeID）
   */
  typeId?: number;
  /**
   * 游戏Code
   */
  gameCode?: string;
  /**
   * 订单状态 0=未结算 1=已结算 2=无效注单，null=全部
   */
  orderStatus?: number;
  /**
   * 
   */
  timeType?: OrderTimeTypeEnum;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值
   */
  betAmountMin?: number;
  /**
   * 投注金额最大值
   */
  betAmountMax?: number;
  /**
   * 盈亏金额最小值
   */
  winLossAmountMin?: number;
  /**
   * 盈亏金额最大值
   */
  winLossAmountMax?: number;
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

export interface NewLotteryBetRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 注单编号
   */
  orderNo: string;
  /**
   * 期号
   */
  issueNumber: string;
  /**
   * 彩种类型ID
   */
  typeId: number;
  /**
   * 游戏名称
   */
  gameName: string;
  /**
   * 投注倍数
   */
  betMultiple: number;
  /**
   * 玩法类型
   */
  playType: string;
  /**
   * 玩法类型名称（中文）
   */
  playTypeStr: string;
  /**
   * 下注内容
   */
  betContent: string;
  /**
   * 开奖结果
   */
  openResult: string;
  /**
   * 投注金额
   */
  betAmount: number;
  /**
   * 有效投注金额
   */
  validBetAmount: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 盈亏金额
   */
  winLossAmount: number;
  /**
   * 退水金额
   */
  waterAmount: number;
  /**
   * 订单状态 0=未结算 1=已结算 2=无效注单
   */
  orderStatus: number;
  /**
   * 订单状态描述
   */
  orderStatusName: string;
  /**
   * 下注时间
   */
  betTime: Date;
  /**
   * 结算时间
   */
  settlementTime: Date;
}

/**
 * @description: 分页获取彩票游戏（NewLottery）投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:NewLottoExport 按钮权限） (Auth) 响应
 * @url: /api/v1/ThirdGame/GetNewLotteryBetRecordPageList
 * @name: NewLotteryBetRecordRspListNewLotteryBetRecordSummaryRspPageBaseResponse
 */
export interface NewLotteryBetRecordRspListNewLotteryBetRecordSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: NewLotteryBetRecordRsp[];
  /**
   * 
   */
  summary: NewLotteryBetRecordSummaryRsp;
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

export type NewLotteryBetRecordRspListNewLotteryBetRecordSummaryRspPageBaseResponseApiResponse = NewLotteryBetRecordRspListNewLotteryBetRecordSummaryRspPageBaseResponse;

export interface NewLotteryBetRecordSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  betAmountSum: number;
  /**
   * 有效投注总额（所有记录）
   */
  validBetAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winAmountSum: number;
  /**
   * 盈亏总额（所有记录）
   */
  winLossAmountSum: number;
  /**
   * 退水总额（所有记录）
   */
  waterAmountSum: number;
  /**
   * 当前页投注总额
   */
  pageBetAmountSum: number;
  /**
   * 当前页有效投注总额
   */
  pageValidBetAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinAmountSum: number;
  /**
   * 当前页盈亏总额
   */
  pageWinLossAmountSum: number;
  /**
   * 当前页退水总额
   */
  pageWaterAmountSum: number;
}

/**
 * @description: 分页获取短信收款记录 (Auth) 请求
 * @url: /api/v1/Recharge/GetOnlineBankingSmsPageList
 * @name: OnlineBankingSmsPageReq
 */
export interface OnlineBankingSmsPageReq {
  /**
   * 内容关键字（模糊匹配 Contents）
   */
  keyWords?: string;
  /**
   * 充值订单号（精确匹配 OrderNumber）
   */
  orderNumber?: string;
  /**
   * 金额（精确匹配 Amount）
   */
  amount?: number;
  /**
   * 收款卡号（精确匹配或末3位模糊匹配 BankAccount）
   */
  bankAccount?: string;
  /**
   * 匹配状态（0=匹配失败 1=匹配成功 2=匹配超时 3=等待匹配）
   */
  state?: number;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
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

export interface OnlineBankingSmsRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 短信记录ID
   */
  banKingID: number;
  /**
   * 会员ID（从 tab_Recharges 联查，无匹配记录时为 null）
   */
  userId: number;
  /**
   * 金额
   */
  amount: number;
  /**
   * 充值订单号
   */
  orderNumber: string;
  /**
   * 匹配状态（0=匹配失败 1=匹配成功 2=匹配超时 3=等待匹配）
   */
  state: number;
  /**
   * 银行名称
   */
  bankName: string;
  /**
   * 收款卡号
   */
  bankAccount: string;
  /**
   * 短信类型（0=入款短信 1=出款短信）
   */
  type: number;
  /**
   * 发送方名称
   */
  sendName: string;
  /**
   * 短信内容
   */
  contents: string;
  /**
   * 短信发送时间
   */
  smsTime: string;
  /**
   * 记录添加时间（yyyy-MM-dd HH:mm:ss）
   */
  addTimeStr: string;
}

/**
 * @description: 分页获取短信收款记录 (Auth) 响应
 * @url: /api/v1/Recharge/GetOnlineBankingSmsPageList
 * @name: OnlineBankingSmsRspListPageBaseResponse
 */
export interface OnlineBankingSmsRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: OnlineBankingSmsRsp[];
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

export type OnlineBankingSmsRspListPageBaseResponseApiResponse = OnlineBankingSmsRspListPageBaseResponse;

/**
 * @description: 分页获取在线会员列表 (Auth) 请求
 * @url: /api/v1/Users/GetOnlineUserPageList
 * @name: OnlineUserPageReq
 */
export interface OnlineUserPageReq {
  /**
   * V1短用户ID
   */
  v1UserId?: number;
  /**
   * 会员账号
   */
  userName?: string;
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

export interface OnlineUserPageRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * V1短用户ID
   */
  v1UserId: number;
  /**
   * 会员账号
   */
  userName: string;
  /**
   * 昵称
   */
  nickName: string;
  /**
   * VIP等级
   */
  vipLevel: number;
  /**
   * 余额
   */
  walletBalance: number;
  /**
   * 是否在线
   */
  isOnline: boolean;
  /**
   * 注册时间
   */
  registerTime: number;
  /**
   * 最后登录时间
   */
  lastLoginTime: number;
}

/**
 * @description: 分页获取在线会员列表 (Auth) 响应
 * @url: /api/v1/Users/GetOnlineUserPageList
 * @name: OnlineUserPageRspListPageBaseResponse
 */
export interface OnlineUserPageRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: OnlineUserPageRsp[];
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

export type OnlineUserPageRspListPageBaseResponseApiResponse = OnlineUserPageRspListPageBaseResponse;

/**
 * @description: 1 - Desc 2 - Asc
 */
export type OrderByEnum = "Desc" | "Asc";

/**
 * @description: 1 - 下注时间 2 - 结算时间
 */
export type OrderTimeTypeEnum = 1 | 2;

/**
 * @description: 分页查询平台日志列表 (Auth) 请求
 * @url: /api/v1/System/GetPlatformLogPageList
 * @name: PlatformLogReq
 */
export interface PlatformLogReq {
  /**
   * 日志类型（1=登录日志，2=操作日志）
   */
  logType?: number;
  /**
   * 日志状态（0=失败，1=成功）
   */
  logState?: number;
  /**
   * 日志标题（操作类型）
   */
  logTitle?: string;
  /**
   * 关键字（搜索日志标题、用户名、页面名称、日志内容）
   */
  keyWords?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
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

export interface PlatformLogRsp {
  /**
   * 日志ID
   */
  logID: number;
  /**
   * 日志标题（操作类型）
   */
  logTitle: string;
  /**
   * 操作用户
   */
  userName: string;
  /**
   * 客户端IP
   */
  userIP: string;
  /**
   * IP所在地
   */
  userIPArea: string;
  /**
   * 操作系统
   */
  userOS: string;
  /**
   * 浏览器类型
   */
  userIE: string;
  /**
   * 日志时间（yyyy-MM-dd HH:mm:ss）
   */
  logDateStr: string;
  /**
   * 日志状态（0=失败，1=成功）
   */
  logState: number;
  /**
   * 日志状态文本（成功/失败）
   */
  logStateStr: string;
  /**
   * 日志内容
   */
  logInfo: string;
  /**
   * 日志类型（1=登录日志，2=操作日志）
   */
  logType: number;
  /**
   * 页面名称
   */
  pageName: string;
  /**
   * 页面地址
   */
  pageUrl: string;
  /**
   * 数据ID
   */
  dataID: number;
  /**
   * 数据名称
   */
  dataName: string;
  /**
   * 数据内容
   */
  dataValue: string;
}

/**
 * @description: 分页查询平台日志列表 (Auth) 响应
 * @url: /api/v1/System/GetPlatformLogPageList
 * @name: PlatformLogRspListPageBaseResponse
 */
export interface PlatformLogRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: PlatformLogRsp[];
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

export type PlatformLogRspListPageBaseResponseApiResponse = PlatformLogRspListPageBaseResponse;

export interface PlayTypeOptionRsp {
  /**
   * 
   */
  text: string;
  /**
   * 
   */
  value: string;
}

/**
 * @description: 批量设置用户状态（State=0禁用，State=1启用，对应V1的SetBatchBan/SetBatchUnset） (Auth) 请求
 * @url: /api/v1/Users/SetBatchUserState
 * @name: SetBatchUserStateReq
 */
export interface SetBatchUserStateReq {
  /**
   * 用户ID列表
   */
  userIds?: number[];
  /**
   * 目标状态（0=禁用，1=启用）
   */
  state?: number;
  /**
   * 备注（可选）
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 设置用户备注 (Auth) 请求
 * @url: /api/v1/Users/UpdateRemark
 * @name: SetUserRemarkReq
 */
export interface SetUserRemarkReq {
  /**
   * 用户ID
   */
  userId?: number;
  /**
   * 备注内容
   */
  remark?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页获取体育游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Sport:Export 按钮权限） (Auth) 请求
 * @url: /api/v1/ThirdGame/GetSportGamesBetRecordPageList
 * @name: SportGamesBetRecordReq
 */
export interface SportGamesBetRecordReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 游戏厂商编码
   */
  vendorCode?: string;
  /**
   * 子游戏编码
   */
  gameCode?: string;
  /**
   * 注单编号
   */
  orderNo?: string;
  /**
   * 订单状态 -1=全部, 0=未结算, 1=已结算, 2=已取消等
   */
  orderStatus?: number;
  /**
   * 是否已结算筛选 0=不筛选 1=仅已结算（包含状态1,4,5,6,7）
   */
  isSettled?: number;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 投注金额最小值
   */
  betAmountMin?: number;
  /**
   * 投注金额最大值
   */
  betAmountMax?: number;
  /**
   * 盈亏金额最小值
   */
  winLossAmountMin?: number;
  /**
   * 盈亏金额最大值
   */
  winLossAmountMax?: number;
  /**
   * 查询时间类型：0=下注时间（BetTime），1=结算时间（SettleTime），null=默认下注时间
   */
  timeType?: number;
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

export interface SportGamesBetRecordRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 注单编号
   */
  orderNo: string;
  /**
   * 游戏厂商编码
   */
  vendorCode: string;
  /**
   * 游戏厂商名称
   */
  vendorName: string;
  /**
   * 游戏名称
   */
  gameName: string;
  /**
   * 运动类型
   */
  sportType: string;
  /**
   * 投注金额
   */
  betAmount: number;
  /**
   * 有效投注金额
   */
  validBetAmount: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 盈亏金额
   */
  winLossAmount: number;
  /**
   * 赔率
   */
  odds: string;
  /**
   * 投注项目
   */
  betMarket: string;
  /**
   * 订单状态
   */
  orderStatus: number;
  /**
   * 订单状态描述
   */
  orderStatusName: string;
  /**
   * 比赛结果
   */
  fMatchResults: string;
  /**
   * 下注内容
   */
  betContent: string;
  /**
   * 下注时间
   */
  betTime: Date;
  /**
   * 结算时间
   */
  settlementTime: Date;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * 投注IP
   */
  betIP: string;
  /**
   * 注单版本号
   */
  versionKey: number;
}

/**
 * @description: 分页获取体育游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Sport:Export 按钮权限） (Auth) 响应
 * @url: /api/v1/ThirdGame/GetSportGamesBetRecordPageList
 * @name: SportGamesBetRecordRspListSportGamesBetRecordSummaryRspPageBaseResponse
 */
export interface SportGamesBetRecordRspListSportGamesBetRecordSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: SportGamesBetRecordRsp[];
  /**
   * 
   */
  summary: SportGamesBetRecordSummaryRsp;
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

export type SportGamesBetRecordRspListSportGamesBetRecordSummaryRspPageBaseResponseApiResponse = SportGamesBetRecordRspListSportGamesBetRecordSummaryRspPageBaseResponse;

export interface SportGamesBetRecordSummaryRsp {
  /**
   * 投注总额（所有记录）
   */
  betAmountSum: number;
  /**
   * 有效投注总额（所有记录）
   */
  validBetAmountSum: number;
  /**
   * 中奖总额（所有记录）
   */
  winAmountSum: number;
  /**
   * 盈亏总额（所有记录）
   */
  winLossAmountSum: number;
  /**
   * 当前页投注总额
   */
  pageBetAmountSum: number;
  /**
   * 当前页有效投注总额
   */
  pageValidBetAmountSum: number;
  /**
   * 当前页中奖总额
   */
  pageWinAmountSum: number;
  /**
   * 当前页盈亏总额
   */
  pageWinLossAmountSum: number;
}

/**
 * @description: 获取平台日志标题下拉列表 (Auth) 响应
 * @url: /api/v1/System/GetPlatformLogTitleList
 * @name: StringListApiResponse
 */
export type StringListApiResponse = string[];

/**
 * @description: 提交人工充值/提款操作 (Auth) 请求
 * @url: /api/v1/Recharge/SubmitManualRecharge
 * @name: SubmitManualRechargeReq
 */
export interface SubmitManualRechargeReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 存取款金额（人工提款/彩金扣除时使用负数）
   */
  amount?: number;
  /**
   * 彩金金额（活动彩金/彩金扣除时使用，扣除时为负数）
   */
  bonus?: number;
  /**
   * 充值类型（人工存款/人工提款/活动彩金/彩金扣除/USDT充值/提现退回/其他）
   */
  playType?: string;
  /**
   * 打码量倍数（全局打码量时传全局值，自定义时传具体数字）
   */
  mosaic?: string;
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
 * @description: 提交人工充值/提款操作 (Auth) 响应
 * @url: /api/v1/Recharge/SubmitManualRecharge
 * @name: SubmitManualRechargeRsp
 */
export interface SubmitManualRechargeRsp {
  /**
   * 是否需要审核（true=已提交审核，false=直接到账）
   */
  needAudit: boolean;
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 实际操作金额
   */
  amount: number;
  /**
   * 实际操作彩金
   */
  bonus: number;
}

export type SubmitManualRechargeRspApiResponse = SubmitManualRechargeRsp;

/**
 * @description: 分页获取下级会员列表 (Auth) 请求
 * @url: /api/v1/Users/GetSubsetUserPageList
 * @name: SubsetUserListReq
 */
export interface SubsetUserListReq {
  /**
   * 代理ID（必填，查询该代理的下级会员）
   */
  relativeId?: string;
  /**
   * 会员ID
   */
  userId?: string;
  /**
   * 用户名
   */
  userName?: string;
  /**
   * 最小层级（1-29）
   */
  minLv?: string;
  /**
   * 最大层级（1-29）
   */
  maxLv?: string;
  /**
   * 渠道ID
   */
  channelId?: string;
  /**
   * 注册设备类型 0=PC 1=安卓 2=苹果
   */
  phoneType?: string;
  /**
   * 用户状态 0=禁用 1=启用
   */
  userState?: string;
  /**
   * 注册开始时间
   */
  startTime?: string;
  /**
   * 注册结束时间
   */
  endTime?: string;
  /**
   * 交易开始时间
   */
  upStartTime?: string;
  /**
   * 交易结束时间
   */
  upEndTime?: string;
  /**
   * VIP等级
   */
  vipLevel?: string;
  /**
   * 备注（模糊查询）
   */
  remark?: string;
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

export interface SubsetUserListRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 账号（需要 Users:Sensitive:ViewMobileOrEmail 权限才能查看完整值，否则脱敏显示）
   */
  userName: string;
  /**
   * VIP等级
   */
  vipLevel: number;
  /**
   * VIP等级文本（L0、L1...）
   */
  vipLevelStr: string;
  /**
   * 上级ID
   */
  parentUserId: number;
  /**
   * 相对层级
   */
  lv: number;
  /**
   * 直属下级数量
   */
  children1Total: number;
  /**
   * 全部下级数量
   */
  childrenTotal: number;
  /**
   * 注册日期（yyyy-MM-dd）
   */
  createTime: string;
  /**
   * 用户状态 0=禁用 1=启用
   */
  userState: number;
  /**
   * 用户状态文本（禁用/启用）
   */
  userStateStr: string;
  /**
   * 在线状态文本（在线/离线）
   */
  onlineStr: string;
  /**
   * 注册设备类型 0=PC 1=Android 2=IOS
   */
  phoneType: number;
  /**
   * 注册设备类型文本（PC/Android/IOS）
   */
  phoneTypeStr: string;
  /**
   * 黑名单 0=正常 1=拉黑
   */
  isBlock: number;
  /**
   * 黑名单文本（正常/拉黑）
   */
  isBlockStr: string;
  /**
   * 投注金额
   */
  gameOrderMoneySum: number;
  /**
   * 投注次数
   */
  gameOrderTimes: number;
  /**
   * 充值金额
   */
  rechargeMoneySum: number;
  /**
   * 充值次数
   */
  rechargeTimes: number;
  /**
   * 提现金额
   */
  withdrawMoneySum: number;
  /**
   * 提现次数
   */
  withdrawTimes: number;
  /**
   * 返佣金额
   */
  commissionMoneySum: number;
  /**
   * 返佣次数
   */
  commissionTimes: number;
  /**
   * 账户余额
   */
  amount: number;
  /**
   * 备注
   */
  remark: string;
}

/**
 * @description: 分页获取下级会员列表 (Auth) 响应
 * @url: /api/v1/Users/GetSubsetUserPageList
 * @name: SubsetUserListRspListSubsetUserListSummaryRspPageBaseResponse
 */
export interface SubsetUserListRspListSubsetUserListSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: SubsetUserListRsp[];
  /**
   * 
   */
  summary: SubsetUserListSummaryRsp;
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

export type SubsetUserListRspListSubsetUserListSummaryRspPageBaseResponseApiResponse = SubsetUserListRspListSubsetUserListSummaryRspPageBaseResponse;

export interface SubsetUserListSummaryRsp {
  /**
   * 投注金额合计
   */
  gameOrderMoneySum: number;
  /**
   * 投注次数合计
   */
  gameOrderTimes: number;
  /**
   * 充值金额合计
   */
  rechargeMoneySum: number;
  /**
   * 充值次数合计
   */
  rechargeTimes: number;
  /**
   * 提现金额合计
   */
  withdrawMoneySum: number;
  /**
   * 提现次数合计
   */
  withdrawTimes: number;
  /**
   * 返佣金额合计
   */
  commissionMoneySum: number;
  /**
   * 返佣次数合计
   */
  commissionTimes: number;
  /**
   * 账户余额合计
   */
  amountSum: number;
}

/**
 * @description: 银行字典 - 变更银行状态 (Auth) 请求
 * @url: /api/v1/Finance/UpdateStateTabBanks
 * @name: TabBanksChangeStateReq
 */
export interface TabBanksChangeStateReq {
  /**
   * 银行ID（必填）
   */
  bankId?: number;
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
 * @description: 银行字典 -  分页获取银行列表 (Auth) 请求
 * @url: /api/v1/Finance/GetTabBanksPageList
 * @name: TabBanksPageReq
 */
export interface TabBanksPageReq {
  /**
   * 银行名称（模糊查询）
   */
  bankName?: string;
  /**
   * 银行代码（模糊查询）
   */
  bankCode?: string;
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

export interface TabBanksRsp {
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * 银行Logo
   */
  bankLogo: string;
  /**
   * 银行名称
   */
  bankName: string;
  /**
   * 银行代码
   */
  bankCode: string;
  /**
   * 
   */
  state: EnableEnum;
  /**
   * 状态文本
   */
  stateStr: string;
  /**
   * 更新时间
   */
  upTime: Date;
  /**
   * 保留字段（提现类型标识）
   */
  reserved: string;
  /**
   * IFSC代码
   */
  ifscCode: string;
}

/**
 * @description: 银行字典 -  分页获取银行列表 (Auth) 响应
 * @url: /api/v1/Finance/GetTabBanksPageList
 * @name: TabBanksRspListPageBaseResponse
 */
export interface TabBanksRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: TabBanksRsp[];
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

export type TabBanksRspListPageBaseResponseApiResponse = TabBanksRspListPageBaseResponse;

/**
 * @description: 设置打码量 (Auth) 请求
 * @url: /api/v1/Users/UpdateActualCoding
 * @name: UpdateActualCodingReq
 */
export interface UpdateActualCodingReq {
  /**
   * 用户ID
   */
  userId?: number;
  /**
   * 打码量
   */
  amountofCode?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 新增会员银行卡 (Auth) 请求
 * @url: /api/v1/Users/AddUserBankCard
 * @name: UserBankCardAddReq
 */
export interface UserBankCardAddReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 银行名称
   */
  bankId?: number;
  /**
   * 收款人姓名
   */
  beneficiaryName?: string;
  /**
   * 卡号
   */
  accountNo?: string;
  /**
   * 手机号
   */
  mobileNO?: string;
  /**
   * IFSC代码
   */
  ifscCode?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 省
   */
  bankProvinceCode?: string;
  /**
   * 市
   */
  bankCityCode?: string;
  /**
   * 分行
   */
  bankBranchAddress?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 删除会员银行卡 (Auth) 请求
 * @url: /api/v1/Users/DeleteUserBankCard
 * @name: UserBankCardDeleteReq
 */
export interface UserBankCardDeleteReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页获取会员银行卡列表 (Auth) 请求
 * @url: /api/v1/Users/GetUserBankCardPageList
 * @name: UserBankCardReq
 */
export interface UserBankCardReq {
  /**
   * 会员ID
   */
  userId?: string;
  /**
   * 账号
   */
  accountNo?: string;
  /**
   * 银行ID
   */
  bankId?: number;
  /**
   * 收款人姓名
   */
  beneficiaryName?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 手机号
   */
  mobileNO?: string;
  /**
   * 银行省份代码
   */
  bankProvinceCode?: string;
  /**
   * 银行城市代码
   */
  bankCityCode?: string;
  /**
   * 银行支行地址
   */
  bankBranchAddress?: string;
  /**
   * CPF（对应IFSCCode字段）
   */
  cpf?: string;
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

export interface UserBankCardRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 主键ID
   */
  bId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * 银行名称（从tab_Banks查询）
   */
  bankNameStr: string;
  /**
   * 收款人姓名
   */
  beneficiaryName: string;
  /**
   * 账号
   */
  accountNo: string;
  /**
   * IFSC代码
   */
  ifscCode: string;
  /**
   * 手机号
   */
  mobileNO: string;
  /**
   * 邮箱（需要 Users:Sensitive:ViewMobileOrEmail 权限才能查看完整值，否则脱敏显示）
   */
  email: string;
  /**
   * 银行省份代码
   */
  bankProvinceCode: string;
  /**
   * 银行城市代码
   */
  bankCityCode: string;
  /**
   * 银行支行地址
   */
  bankBranchAddress: string;
  /**
   * 添加时间
   */
  addTime: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 最后更新操作人
   */
  lastUpdateOperator: string;
}

/**
 * @description: 分页获取会员银行卡列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserBankCardPageList
 * @name: UserBankCardRspListPageBaseResponse
 */
export interface UserBankCardRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserBankCardRsp[];
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

export type UserBankCardRspListPageBaseResponseApiResponse = UserBankCardRspListPageBaseResponse;

/**
 * @description: 编辑会员银行卡 (Auth) 请求
 * @url: /api/v1/Users/UpdateUserBankCard
 * @name: UserBankCardUpdateReq
 */
export interface UserBankCardUpdateReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 银行名称
   */
  bankId?: number;
  /**
   * 收款人姓名
   */
  beneficiaryName?: string;
  /**
   * 卡号
   */
  accountNo?: string;
  /**
   * 手机号
   */
  mobileNO?: string;
  /**
   * IFSC代码
   */
  ifscCode?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 省
   */
  bankProvinceCode?: string;
  /**
   * 市
   */
  bankCityCode?: string;
  /**
   * 分行
   */
  bankBranchAddress?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取用户打码统计报表 (Auth) 请求
 * @url: /api/v1/Users/GetUserBetTotal
 * @name: UserBetTotalReq
 */
export interface UserBetTotalReq {
  /**
   * 用户ID（必填）
   */
  userId?: number;
  /**
   * 开始时间（格式: yyyy-MM-dd HH:mm:ss）
   */
  startTime?: string;
  /**
   * 结束时间（格式: yyyy-MM-dd HH:mm:ss）
   */
  endTime?: string;
  /**
   * 是否从上次提现至今（暂不使用）
   */
  sinceLastWithdraw?: boolean;
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

export interface UserBetTotalRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 游戏大类类型（0=电子 1=真人 2=体育 3=彩票 4=棋牌）
   */
  categoryType: number;
  /**
   * 游戏大类文本（Electronic/Video/Sports/Lottery/ChessCard）
   */
  categoryTypeStr: string;
  /**
   * 游戏类别
   */
  gameCategory: string;
  /**
   * 厂商代码
   */
  vendorCode: string;
  /**
   * 厂商展示名称
   */
  vendorDisplayName: string;
  /**
   * 游戏名称
   */
  gameName: string;
  /**
   * 游戏编码
   */
  gameCode: string;
  /**
   * 游戏类型（仅 ARLottery 厂商有值，取 GameCode 按 _ 分割的第一段，如 WinGo_30S → WinGo）
   */
  gameType: string;
  /**
   * 总投注笔数
   */
  betCount: number;
  /**
   * 总下注金额
   */
  betAmount: number;
  /**
   * 总有效投注金额
   */
  validAmount: number;
  /**
   * 总中奖金额（含投注金额）
   */
  winAmount: number;
  /**
   * 盈亏金额（投注金额 - 派彩金额）
   */
  winLoseAmount: number;
}

/**
 * @description: 获取用户打码统计报表 (Auth) 响应
 * @url: /api/v1/Users/GetUserBetTotal
 * @name: UserBetTotalRspListUserBetTotalSummaryRspPageBaseResponse
 */
export interface UserBetTotalRspListUserBetTotalSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserBetTotalRsp[];
  /**
   * 
   */
  summary: UserBetTotalSummaryRsp;
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

export type UserBetTotalRspListUserBetTotalSummaryRspPageBaseResponseApiResponse = UserBetTotalRspListUserBetTotalSummaryRspPageBaseResponse;

export interface UserBetTotalSummaryRsp {
  /**
   * 当前页总投注笔数
   */
  pageBetCount: number;
  /**
   * 当前页总下注金额
   */
  pageBetAmount: number;
  /**
   * 当前页总有效投注金额
   */
  pageValidAmount: number;
  /**
   * 当前页总中奖金额
   */
  pageWinAmount: number;
  /**
   * 当前页总盈亏金额
   */
  pageWinLoseAmount: number;
  /**
   * 全部总投注笔数
   */
  totalBetCount: number;
  /**
   * 全部总下注金额
   */
  totalBetAmount: number;
  /**
   * 全部总有效投注金额
   */
  totalValidAmount: number;
  /**
   * 全部总中奖金额
   */
  totalWinAmount: number;
  /**
   * 全部总盈亏金额
   */
  totalWinLoseAmount: number;
}

/**
 * @description: 新增会员PIX钱包 (Auth) 请求
 * @url: /api/v1/Users/AddUserCpf
 * @name: UserCpfAddReq
 */
export interface UserCpfAddReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 钱包类型
   */
  bankId?: number;
  /**
   * PIX账号
   */
  accountNo?: string;
  /**
   * 姓名
   */
  beneficiaryName?: string;
  /**
   * CPF
   */
  cpf?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 删除会员PIX钱包 (Auth) 请求
 * @url: /api/v1/Users/DeleteUserCpf
 * @name: UserCpfDeleteReq
 */
export interface UserCpfDeleteReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface UserCpfRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 主键ID
   */
  bId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * 银行名称（从tab_Banks查询）
   */
  bankNameStr: string;
  /**
   * 收款人姓名
   */
  beneficiaryName: string;
  /**
   * 账号
   */
  accountNo: string;
  /**
   * CPF（对应IFSCCode字段）
   */
  cpf: string;
  /**
   * 手机号
   */
  mobileNO: string;
  /**
   * 添加时间
   */
  addTime: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 最后更新操作人
   */
  lastUpdateOperator: string;
}

/**
 * @description: 分页获取会员CPF列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserCpfPageList
 * @name: UserCpfRspListPageBaseResponse
 */
export interface UserCpfRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserCpfRsp[];
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

export type UserCpfRspListPageBaseResponseApiResponse = UserCpfRspListPageBaseResponse;

/**
 * @description: 编辑会员PIX钱包 (Auth) 请求
 * @url: /api/v1/Users/UpdateUserCpf
 * @name: UserCpfUpdateReq
 */
export interface UserCpfUpdateReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 钱包类型
   */
  bankId?: number;
  /**
   * PIX账号
   */
  accountNo?: string;
  /**
   * 姓名
   */
  beneficiaryName?: string;
  /**
   * CPF
   */
  cpf?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface UserDetailInfo {
  /**
   * 用户名（需要 Users:Sensitive:ViewMobileOrEmail 权限才能查看完整值，否则脱敏显示）
   */
  userName?: string;
  /**
   * 用户ID
   */
  userId?: number;
  /**
   * 会员ID
   */
  user_ID?: string;
  /**
   * 账号
   */
  user_Name?: string;
  /**
   * 绑定(邮箱/手机号)（需要 Users:Sensitive:ViewMobileOrEmail 权限才能查看完整值，否则脱敏显示）
   */
  user_Name2?: string;
  /**
   * 注册时间
   */
  createTime?: Date;
  /**
   * 注册时间
   */
  userRegisterTime?: string;
  /**
   * 注册IP
   */
  userRegisterIP?: string;
  /**
   * 同IP注册用户数
   */
  userRegisterSameIPCount?: number;
  /**
   * 注册设备
   */
  userRegisterDevice?: string;
  /**
   * 同设备注册用户数
   */
  userRegisterSameDeviceCount?: number;
  /**
   * 首次登录时间
   */
  userLoginDate?: Date;
  /**
   * 用户余额
   */
  userAmount?: number;
  /**
   * 当前需打码量
   */
  amountofCode?: number;
  /**
   * 累计打码量
   */
  allAmountofCode?: number;
  /**
   * 需要打码量
   */
  needAmountofCode?: number;
  /**
   * 本次打码倍数
   */
  thisCodingAmount?: number;
  /**
   * 会员洗码量
   */
  codeWash_Amount?: number;
  /**
   * 返水金额
   */
  backWater_Amount?: number;
  /**
   * 上级代理ID
   */
  parentUserID?: number;
  /**
   * 充值等级
   */
  rechargesLeve?: number;
  /**
   * 充值等级文本（L0、L1...）
   */
  rechargesLeveStr?: string;
  /**
   * 用户积分
   */
  integral?: number;
  /**
   * 用户备注
   */
  remark?: string;
  /**
   * 语种
   */
  useLanguage?: string;
  /**
   * 用户状态 0=禁用 1=启用
   */
  userState?: number;
  /**
   * 用户状态文本（禁用/启用）
   */
  userStateStr?: string;
  /**
   * 注册类型
   */
  regType?: number;
  /**
   * 是否有效 0=否 1=是
   */
  isValid?: number;
  /**
   * 是否有效文本（否/是）
   */
  isValidStr?: string;
  /**
   * 是否领取返佣 0=否 1=是
   */
  isRebate_Bet?: number;
  /**
   * 是否领取返佣文本（否/是）
   */
  isRebateBetStr?: string;
  /**
   * VIP等级
   */
  userVipLevelId?: number;
  /**
   * VIP经验值
   */
  userVipExperienceId?: number;
  /**
   * 保险箱余额
   */
  safeAmount?: number;
  /**
   * 待领取收益
   */
  safeEarnings?: number;
  /**
   * 已领取收益
   */
  safeTotalEarnings?: number;
  /**
   * 保险箱利率
   */
  dayShareRate?: number;
  /**
   * 下级数量
   */
  children_1_Total?: number;
  /**
   * 合伙人奖励
   */
  partnerReward?: number;
  /**
   * 回归奖励
   */
  oldUserReturnAward?: number;
  /**
   * 邀请转盘奖励
   */
  turntableInviteReward?: number;
  /**
   * 回归新充值奖励
   */
  returnNewRechargeReward?: number;
  /**
   * 代理红包充值
   */
  redEnvelope_Recharge?: number;
  /**
   * TG频道活动奖励
   */
  tgActivityAward?: number;
  /**
   * VIP升级礼包
   */
  vipReward_1?: number;
  /**
   * VIP每月奖励
   */
  vipReward_2?: number;
  /**
   * VIP升级礼包积分
   */
  vipIntegral_1?: number;
  /**
   * VIP每月奖励积分
   */
  vipIntegral_2?: number;
  /**
   * 邀请等级
   */
  integral_Invite_Level?: number;
  /**
   * 首充金额
   */
  recharge_1_Amount?: number;
  /**
   * 首充日期
   */
  recharge_1_Time?: string;
  /**
   * 次充金额
   */
  recharge_2_Amount?: number;
  /**
   * 次充日期
   */
  recharge_2_Time?: string;
  /**
   * 三充金额
   */
  recharge_3_Amount?: number;
  /**
   * 三充日期
   */
  recharge_3_Time?: string;
  /**
   * 累计充值
   */
  userRechargePriceSum_All?: number;
  /**
   * 今日充值金额
   */
  userRechargePriceSum_Today?: number;
  /**
   * 累计提现
   */
  userWithdrawPriceSum_All?: number;
  /**
   * 今日提现金额
   */
  userWithdrawPriceSum_Today?: number;
  /**
   * 等待出款（状态0+状态3）
   */
  userWithdrawPriceSum_0?: number;
  /**
   * 等待出款（状态3）
   */
  userWithdrawPriceSum_3?: number;
  /**
   * 累计充值次数
   */
  recharge_Times_All?: number;
  /**
   * 累计提现次数（已通过）
   */
  withdraw_Times_1?: number;
  /**
   * 累计提现手续费
   */
  userWithdrawCommissionSum_All?: number;
  /**
   * 累计充提差
   */
  recharge_Withdraw_Sum_All?: number;
  /**
   * 今日充提差
   */
  cwDifference_Today?: number;
  /**
   * 累计充提差
   */
  cwDifference_All?: number;
  /**
   * 今日有效投注
   */
  validAmount_Today?: number;
  /**
   * 累计有效投注
   */
  validAmount_All?: number;
  /**
   * 今日输赢
   */
  profitAmount_Today?: number;
  /**
   * 累计输赢
   */
  profitAmount_All?: number;
  /**
   * 今日活动优惠
   */
  activityDiscount_Today?: number;
  /**
   * 累计活动优惠
   */
  activityDiscount_All?: number;
  /**
   * 未开奖下注金额
   */
  userBetAmount?: number;
  /**
   * 统计开始时间
   */
  betTotalBegin?: string;
  /**
   * 统计结束时间
   */
  betTotalEnd?: string;
  /**
   * 总获得佣金（Finance Type=1）
   */
  financeCommission?: number;
  /**
   * 已领红包（Finance Type=3）
   */
  financeRedEnvelope?: number;
  /**
   * 每日签到（Finance Type=7）
   */
  financeDailySignIn?: number;
  /**
   * 超级大奖（Finance Type=103）
   */
  financeSuperJackpot?: number;
  /**
   * 新手礼包（Finance Type=113）
   */
  financeNewbieGift?: number;
  /**
   * 锦标赛奖励（Finance Type=114）
   */
  financeTournament?: number;
  /**
   * 新会员礼包（Finance Type=116+117）
   */
  financeNewMemberGift?: number;
  /**
   * 每周奖励（Finance Type=107）
   */
  financeWeeklyAward?: number;
  /**
   * 每日奖励（Finance Type=118）
   */
  financeDailyAward?: number;
  /**
   * 充值赠送（Finance Type=10）
   */
  financeRechargeGift?: number;
  /**
   * 人工充值（Finance Type=11）
   */
  financeManualRecharge?: number;
  /**
   * 注册送金（Finance Type=12）
   */
  financeRegisterBonus?: number;
  /**
   * 彩金充值（Finance Type=13）
   */
  financeBonusRecharge?: number;
  /**
   * 首充奖励（Finance Type=14）
   */
  financeFirstRechargeReward?: number;
  /**
   * 大转盘（Finance Type=119）
   */
  financeBigWheel?: number;
  /**
   * 邀请奖励（Finance Type=20）
   */
  financeInviteReward?: number;
}

/**
 * @description: 获取会员详情 (Auth) 请求
 * @url: /api/v1/Users/GetUserDetail
 * @name: UserDetailsReq
 */
export interface UserDetailsReq {
  /**
   * 用户ID
   */
  userId?: number;
  /**
   * 查询开始时间 (格式: YYYY-MM-DD)
   */
  startTime?: string;
  /**
   * 查询结束时间 (格式: YYYY-MM-DD)
   */
  endTime?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取会员详情 (Auth) 响应
 * @url: /api/v1/Users/GetUserDetail
 * @name: UserDetailsRsp
 */
export interface UserDetailsRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 
   */
  userInfo: UserDetailInfo;
  /**
   * 登录日志列表（最近3条）
   */
  loginLogList: UserLoginLogInfo[];
  /**
   * 充值记录列表（最近3条）
   */
  rechargeList: UserRechargeInfo[];
  /**
   * 提现记录列表（最近3条）
   */
  withdrawList: UserWithdrawInfo[];
  /**
   * 资金账变汇总列表
   */
  financeList: UserFinanceInfo[];
  /**
   * 游戏记录汇总列表
   */
  lotteryList: UserLotteryInfo[];
  /**
   * 最近提现时间（取自提现记录列表中最新一条）
   */
  lastWithdrawTime: string;
  /**
   * Third game balance.
   */
  thirdamout: number;
}

export type UserDetailsRspApiResponse = UserDetailsRsp;

export interface UserFinanceInfo {
  /**
   * 资金变动类型
   */
  type?: number;
  /**
   * 金额累计
   */
  financeAmountSum?: number;
  /**
   * 操作次数
   */
  finance_TimesSum?: number;
}

export interface UserLoginLogInfo {
  /**
   * 登录时间
   */
  time?: string;
  /**
   * 登录IP
   */
  loginIp?: string;
  /**
   * 同IP登录的用户数
   */
  ip_UserID_Count?: number;
}

export interface UserLotteryInfo {
  /**
   * 游戏类型ID
   */
  type?: number;
  /**
   * 下注总额
   */
  lotteryAmountSum?: number;
  /**
   * 服务器返利
   */
  serverAmountSum?: number;
  /**
   * 利润 (下注-返利)
   */
  profitAmountSum?: number;
  /**
   * 下注次数
   */
  lotteryTimesSum?: number;
  /**
   * 游戏分类 (0=电子, 1=视讯, 2=体育, 4=棋牌)
   */
  categoryType?: number;
}

/**
 * @description: 分页获取会员列表 (Auth) 请求
 * @url: /api/v1/Users/GetUserPageList
 * @name: UserManageReq
 */
export interface UserManageReq {
  /**
   * 会员ID（支持多个ID空格分隔）
   */
  userId?: string;
  /**
   * 用户名（支持模糊查询）
   */
  userName?: string;
  /**
   * 注册IP
   */
  registerIp?: string;
  /**
   * 邀请码
   */
  inviterCode?: string;
  /**
   * 注册开始时间
   */
  startTime?: string;
  /**
   * 注册结束时间
   */
  endTime?: string;
  /**
   * 渠道ID (null或-1表示全部)
   */
  channelId?: string;
  /**
   * 代理ID
   */
  relativeId?: string;
  /**
   * 注册设备类型 0=PC 1=安卓 2=苹果
   */
  phoneType?: string;
  /**
   * 注册指纹/设备ID
   */
  registerDevice?: string;
  /**
   * 用户状态 0=禁用 1=启用
   */
  userState?: string;
  /**
   * 黑名单状态 0=否 1=是
   */
  blockStates?: string;
  /**
   * 是否来自统计
   */
  isBasic?: string;
  /**
   * 会员分组ID
   */
  userGroupId?: string;
  /**
   * 充值等级
   */
  rechargeLevel?: string;
  /**
   * VIP等级
   */
  vipLevel?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 在线状态 0=离线 1=在线
   */
  online?: string;
  /**
   * 最后在线开始时间
   */
  activityStartTime?: string;
  /**
   * 最后在线结束时间
   */
  activityEndTime?: string;
  /**
   * 活动黑名单状态 0=否 1=是
   */
  activeBlockState?: string;
  /**
   * 代理类型 0=未开通 1=外部代理 2=内部代理
   */
  agentType?: string;
  /**
   * 排序方式（合并余额排序和保险箱余额排序）
可选值：AddTime desc(默认), Amount asc, Amount desc, SafeAmount asc, SafeAmount desc
   */
  orderByField?: string;
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

export interface UserManageRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户ID号
   */
  userId: number;
  /**
   * 应用ID号
   */
  appId: number;
  /**
   * 上级用户（vw_tab_Users.Superior，非代理层级ID）
   */
  superior: number;
  /**
   * 上级代理ID（来自 tb_chart_relative.ParentUserID，与V1一致）
   */
  parentUserId: number;
  /**
   * 所属分组ID
   */
  groupId: number;
  /**
   * 用户权限
   */
  roleId: number;
  /**
   * 拥有ID号
   */
  ownerId: number;
  /**
   * 所属ID号
   */
  belongId: number;
  /**
   * 分类ID号
   */
  typeId: number;
  /**
   * 会员类型
   */
  userType: number;
  /**
   * 代理类型 0=未开通 1=外部代理 2=内部代理
   */
  agentType: number;
  /**
   * 代理类型文本（未开通/外部代理/内部代理）
   */
  agentTypeStr: string;
  /**
   * 手机号/用户名（需要Users:Sensitive:ViewMobileOrEmail 权限才能查看完整值，否则脱敏显示）
   */
  userName: string;
  /**
   * 余额
   */
  amount: number;
  /**
   * Third game balance.
   */
  thirdamout: number;
  /**
   * 邀请码
   */
  inviterCode: string;
  /**
   * 头像
   */
  userPhoto: string;
  /**
   * 性别 0=男 1=女
   */
  sex: number;
  /**
   * 用户有效起始时间
   */
  userStartDate: Date;
  /**
   * 注册时间
   */
  addTime: Date;
  /**
   * 用户状态 0=禁用 1=启用
   */
  userState: number;
  /**
   * 用户状态文本（禁用/启用）
   */
  userStateStr: string;
  /**
   * 登录次数
   */
  userLoginCount: number;
  /**
   * 最后活动时间
   */
  userActivityDate: Date;
  /**
   * 在线状态文本（在线/离线）
   */
  isOnlineStr: string;
  /**
   * 登入时间
   */
  userLoginDate: Date;
  /**
   * 最后活动IP
   */
  userActivityIp: string;
  /**
   * 登入IP
   */
  userLoginIp: string;
  /**
   * 渠道编号
   */
  channelCode: number;
  /**
   * 注册IP
   */
  registerIp: string;
  /**
   * 注册设备类型 0=PC 1=安卓 2=苹果
   */
  phoneType: number;
  /**
   * 注册设备类型文本（PC/Android/IOS/未知）
   */
  phoneTypeStr: string;
  /**
   * 昵称
   */
  nickName: string;
  /**
   * Code
   */
  code: string;
  /**
   * 剩余可发红包金额
   */
  redAmount: number;
  /**
   * 打码量
   */
  amountOfCode: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 投注返佣状态
   */
  rebateStateBet: number;
  /**
   * 首充返佣状态
   */
  rebateStateRecharge: number;
  /**
   * 充值等级
   */
  rechargeLevel: number;
  /**
   * 充值次数
   */
  rechargeTimes: number;
  /**
   * 充值金额
   */
  rechargeAmounts: number;
  /**
   * 首充时间
   */
  rechargeTimeFirst: string;
  /**
   * 最后充值时间
   */
  rechargeTimeLast: string;
  /**
   * 是否绑定前台谷歌 0=否 1=是
   */
  isValidator: number;
  /**
   * 前台谷歌验证文本（未绑定/已绑定）
   */
  isValidatorStr: string;
  /**
   * 积分（整数，与V1一致）
   */
  integral: number;
  /**
   * IsValid
   */
  isValid: number;
  /**
   * 邀请会员返积分等级
   */
  integralInviteLevel: number;
  /**
   * 分组名
   */
  userGroupName: string;
  /**
   * 黑名单 0=否 1=是
   */
  isBlock: number;
  /**
   * 黑名单文本（正常/拉黑）
   */
  isBlockStr: string;
  /**
   * VIP等级
   */
  vipLevel: number;
  /**
   * 保险箱余额
   */
  safeAmount: string;
  /**
   * FireBaseToken
   */
  fireBaseToken: string;
  /**
   * 总充值次数
   */
  rechargeTotal: number;
  /**
   * 总提现次数
   */
  withdrawTotal: number;
  /**
   * 是否绑定Google验证 0=未绑定 1=已绑定
   */
  googleVerifyBind: number;
  /**
   * Google验证是否启用 0=未使用 1=已使用
   */
  googleVerifyStatus: number;
  /**
   * 后台Google验证绑定文本（未绑定/已绑定）
   */
  googleVerifyBindStr: string;
  /**
   * 后台Google验证启用文本（未使用/已使用）
   */
  googleVerifyStatusStr: string;
}

/**
 * @description: 分页获取会员列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserPageList
 * @name: UserManageRspListUserManageSummaryRspPageBaseResponse
 */
export interface UserManageRspListUserManageSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserManageRsp[];
  /**
   * 
   */
  summary: UserManageSummaryRsp;
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

export type UserManageRspListUserManageSummaryRspPageBaseResponseApiResponse = UserManageRspListUserManageSummaryRspPageBaseResponse;

export interface UserManageSummaryRsp {
  /**
   * 当前页会员总余额
   */
  pageSumAmount: number;
  /**
   * 
   */
  pageSumThirdamout: number;
  /**
   * 当前页会员总红利额
   */
  pageSumRedAmount: number;
  /**
   * 满足条件所有会员总余额
   */
  amountSum: number;
  /**
   * 满足条件所有会员总红利额
   */
  redAmountSum: number;
}

/**
 * @description: 删除会员实名 (Auth) 请求
 * @url: /api/v1/Users/DeleteUserRealName
 * @name: UserRealNameDeleteReq
 */
export interface UserRealNameDeleteReq {
  /**
   * 主键ID
   */
  realId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页获取用户实名认证列表 (Auth) 请求
 * @url: /api/v1/Users/GetUserRealNamePageList
 * @name: UserRealNameReq
 */
export interface UserRealNameReq {
  /**
   * 会员ID
   */
  userId?: string;
  /**
   * CPF（对应IDCard字段）
   */
  cpf?: string;
  /**
   * 收款人姓名（对应RealName字段）
   */
  beneficiaryName?: string;
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

export interface UserRealNameRsp {
  /**
   * 主键ID
   */
  realId: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 真实姓名
   */
  realName: string;
  /**
   * 身份证号/CPF
   */
  idCard: string;
  /**
   * 添加时间
   */
  addTime: string;
  /**
   * 更新时间
   */
  upTime: string;
}

/**
 * @description: 分页获取用户实名认证列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserRealNamePageList
 * @name: UserRealNameRspListPageBaseResponse
 */
export interface UserRealNameRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserRealNameRsp[];
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

export type UserRealNameRspListPageBaseResponseApiResponse = UserRealNameRspListPageBaseResponse;

/**
 * @description: 编辑会员实名 (Auth) 请求
 * @url: /api/v1/Users/UpdateUserRealName
 * @name: UserRealNameUpdateReq
 */
export interface UserRealNameUpdateReq {
  /**
   * 主键ID
   */
  realId?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 姓名
   */
  realName?: string;
  /**
   * CPF
   */
  cpf?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface UserRechargeInfo {
  /**
   * 充值时间
   */
  upTime?: string;
  /**
   * 充值金额
   */
  price?: number;
  /**
   * 充值方式类型
   */
  type?: string;
  /**
   * 充值通道ID
   */
  payTypeId?: number;
}

/**
 * @description: 分页获取会员层级列表 (Auth) 请求
 * @url: /api/v1/Users/GetUserRelativePageList
 * @name: UserRelativeReq
 */
export interface UserRelativeReq {
  /**
   * 查询类型：D=日，C=区间，M=月，A=全部
   */
  type?: string;
  /**
   * 会员ID
   */
  userId?: string;
  /**
   * 代理类型 0=未开通 1=外部代理 2=内部代理
   */
  agentType?: string;
  /**
   * 绝对层级
   */
  lv?: string;
  /**
   * 查询日期（yyyy-MM-dd，日模式使用）
   */
  date?: string;
  /**
   * 查询开始时间（yyyy-MM-dd，区间模式使用）
   */
  startTime?: string;
  /**
   * 查询结束时间（yyyy-MM-dd，区间模式使用）
   */
  endTime?: string;
  /**
   * 查询月份（yyyy-MM，月模式使用）
   */
  month?: string;
  /**
   * 排序方式 0=默认 1=充值金额升序 2=充值金额降序
   */
  order?: number;
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

export interface UserRelativeRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 账号（需要 Users:Sensitive:ViewMobileOrEmail 权限才能查看完整值，否则脱敏显示）
   */
  userName: string;
  /**
   * 上级ID
   */
  parentUserId: number;
  /**
   * 绝对层级
   */
  lv: number;
  /**
   * 直属下级数量
   */
  children1Total: number;
  /**
   * 全部下级数量
   */
  childrenTotal: number;
  /**
   * 代理类型 0=未开通 1=外部代理 2=内部代理
   */
  agentType: number;
  /**
   * 代理类型文本（未开通/外部代理/内部代理）
   */
  agentTypeStr: string;
  /**
   * 注册时间
   */
  addTime: Date;
  /**
   * 投注金额
   */
  lotteryAmount: number;
  /**
   * 投注次数
   */
  lotteryTimes: number;
  /**
   * 中奖金额
   */
  winAmount: number;
  /**
   * 中奖次数
   */
  winTimes: number;
  /**
   * 佣金（投注返佣 + 首充返佣）
   */
  commissionAmount: number;
  /**
   * 充值金额
   */
  rechargeAmount: number;
  /**
   * 充值次数
   */
  rechargeTimes: number;
  /**
   * 提现金额
   */
  withdrawAmount: number;
  /**
   * 提现次数
   */
  withdrawTimes: number;
  /**
   * 红包金额
   */
  redEnvelopeAmount: number;
  /**
   * 签到金额
   */
  signInAmount: number;
  /**
   * 代理红包金额
   */
  agentRedEnvelopeAmount: number;
  /**
   * 充值赠送金额
   */
  rechargeGiftAmount: number;
  /**
   * 注册送金金额
   */
  registerGiftAmount: number;
  /**
   * 彩金充值金额
   */
  bonusRechargeAmount: number;
  /**
   * 首充满赠送金额
   */
  firstRechargeGiftAmount: number;
}

/**
 * @description: 分页获取会员层级列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserRelativePageList
 * @name: UserRelativeRspListUserRelativeSummaryRspPageBaseResponse
 */
export interface UserRelativeRspListUserRelativeSummaryRspPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserRelativeRsp[];
  /**
   * 
   */
  summary: UserRelativeSummaryRsp;
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

export type UserRelativeRspListUserRelativeSummaryRspPageBaseResponseApiResponse = UserRelativeRspListUserRelativeSummaryRspPageBaseResponse;

export interface UserRelativeSummaryRsp {
  /**
   * 当前页投注金额
   */
  pageLotteryAmount: number;
  /**
   * 当前页投注次数
   */
  pageLotteryTimes: number;
  /**
   * 当前页投注人数
   */
  pageLotteryUsers: number;
  /**
   * 当前页中奖金额
   */
  pageWinAmount: number;
  /**
   * 当前页中奖次数
   */
  pageWinTimes: number;
  /**
   * 当前页中奖人数
   */
  pageWinUsers: number;
  /**
   * 当前页佣金（投注返佣 + 首充返佣）
   */
  pageCommissionAmount: number;
  /**
   * 当前页充值金额
   */
  pageRechargeAmount: number;
  /**
   * 当前页充值次数
   */
  pageRechargeTimes: number;
  /**
   * 当前页充值人数
   */
  pageRechargeUsers: number;
  /**
   * 当前页提现金额
   */
  pageWithdrawAmount: number;
  /**
   * 当前页提现次数
   */
  pageWithdrawTimes: number;
  /**
   * 当前页提现人数
   */
  pageWithdrawUsers: number;
  /**
   * 当前页红包金额
   */
  pageRedEnvelopeAmount: number;
  /**
   * 当前页签到金额
   */
  pageSignInAmount: number;
  /**
   * 当前页代理红包金额
   */
  pageAgentRedEnvelopeAmount: number;
  /**
   * 当前页充值赠送金额
   */
  pageRechargeGiftAmount: number;
  /**
   * 当前页注册送金金额
   */
  pageRegisterGiftAmount: number;
  /**
   * 当前页彩金充值金额
   */
  pageBonusRechargeAmount: number;
  /**
   * 当前页首充满赠送金额
   */
  pageFirstRechargeGiftAmount: number;
  /**
   * 全部投注金额
   */
  allLotteryAmount: number;
  /**
   * 全部投注次数
   */
  allLotteryTimes: number;
  /**
   * 全部投注人数
   */
  allLotteryUsers: number;
  /**
   * 全部中奖金额
   */
  allWinAmount: number;
  /**
   * 全部中奖次数
   */
  allWinTimes: number;
  /**
   * 全部中奖人数
   */
  allWinUsers: number;
  /**
   * 全部佣金（投注返佣 + 首充返佣）
   */
  allCommissionAmount: number;
  /**
   * 全部充值金额
   */
  allRechargeAmount: number;
  /**
   * 全部充值次数
   */
  allRechargeTimes: number;
  /**
   * 全部充值人数
   */
  allRechargeUsers: number;
  /**
   * 全部提现金额
   */
  allWithdrawAmount: number;
  /**
   * 全部提现次数
   */
  allWithdrawTimes: number;
  /**
   * 全部提现人数
   */
  allWithdrawUsers: number;
  /**
   * 全部红包金额
   */
  allRedEnvelopeAmount: number;
  /**
   * 全部签到金额
   */
  allSignInAmount: number;
  /**
   * 全部代理红包金额
   */
  allAgentRedEnvelopeAmount: number;
  /**
   * 全部充值赠送金额
   */
  allRechargeGiftAmount: number;
  /**
   * 全部注册送金金额
   */
  allRegisterGiftAmount: number;
  /**
   * 全部彩金充值金额
   */
  allBonusRechargeAmount: number;
  /**
   * 全部首充满赠送金额
   */
  allFirstRechargeGiftAmount: number;
}

/**
 * @description: 新增会员UPI (Auth) 请求
 * @url: /api/v1/Users/AddUPI
 * @name: UserUpiAddReq
 */
export interface UserUpiAddReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * UPI类型
   */
  withType?: number;
  /**
   * 姓名
   */
  beneficiaryName?: string;
  /**
   * UPI账号
   */
  accountNo?: string;
  /**
   * 手机号
   */
  mobileNO?: string;
  /**
   * KYC-银行编码
   */
  bankCode?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 删除会员UPI (Auth) 请求
 * @url: /api/v1/Users/DeleteUPI
 * @name: UserUpiDeleteReq
 */
export interface UserUpiDeleteReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 分页获取会员UPI列表 (Auth) 请求
 * @url: /api/v1/Users/GetUPIPageList
 * @name: UserUpiPageReq
 */
export interface UserUpiPageReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 提现类型
   */
  withType?: number;
  /**
   * UPI账号
   */
  accountNo?: string;
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

export interface UserUpiPageRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 商户名称
   */
  tenantName: string;
  /**
   * 主键ID
   */
  bId: number;
  /**
   * 会员ID
   */
  userId: number;
  /**
   * 提现类型
   */
  withType: number;
  /**
   * 提现类型名称
   */
  withTypeName: string;
  /**
   * UPI账号
   */
  accountNo: string;
  /**
   * 收款人姓名
   */
  beneficiaryName: string;
  /**
   * 手机号
   */
  mobileNO: string;
  /**
   * 银行编码
   */
  bankCode: string;
  /**
   * 添加时间
   */
  addTime: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 最后更新操作人
   */
  lastUpdateOperator: string;
}

/**
 * @description: 分页获取会员UPI列表 (Auth) 响应
 * @url: /api/v1/Users/GetUPIPageList
 * @name: UserUpiPageRspListPageBaseResponse
 */
export interface UserUpiPageRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserUpiPageRsp[];
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

export type UserUpiPageRspListPageBaseResponseApiResponse = UserUpiPageRspListPageBaseResponse;

/**
 * @description: 编辑会员UPI (Auth) 请求
 * @url: /api/v1/Users/UpdateUPI
 * @name: UserUpiUpdateReq
 */
export interface UserUpiUpdateReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * UPI类型
   */
  withType?: number;
  /**
   * 姓名
   */
  beneficiaryName?: string;
  /**
   * UPI账号
   */
  accountNo?: string;
  /**
   * 手机号
   */
  mobileNO?: string;
  /**
   * KYC-银行编码
   */
  bankCode?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 新增会员USDT钱包 (Auth) 请求
 * @url: /api/v1/Users/AddUserUsdt
 * @name: UserUsdtAddReq
 */
export interface UserUsdtAddReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 网络协议
   */
  bankId?: number;
  /**
   * 钱包地址
   */
  accountNo?: string;
  /**
   * 地址别称
   */
  beneficiaryName?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 删除会员USDT钱包 (Auth) 请求
 * @url: /api/v1/Users/DeleteUserUsdt
 * @name: UserUsdtDeleteReq
 */
export interface UserUsdtDeleteReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface UserUsdtRsp {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 主键ID
   */
  bId: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * 钱包名称（从tab_Banks查询）
   */
  bankNameStr: string;
  /**
   * 收款人姓名
   */
  beneficiaryName: string;
  /**
   * 账号（钱包地址）
   */
  accountNo: string;
  /**
   * 手机号
   */
  mobileNO: string;
  /**
   * 添加时间
   */
  addTime: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 最后更新操作人
   */
  lastUpdateOperator: string;
}

/**
 * @description: 分页获取会员USDT列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserUsdtPageList
 * @name: UserUsdtRspListPageBaseResponse
 */
export interface UserUsdtRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserUsdtRsp[];
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

export type UserUsdtRspListPageBaseResponseApiResponse = UserUsdtRspListPageBaseResponse;

/**
 * @description: 编辑会员USDT钱包 (Auth) 请求
 * @url: /api/v1/Users/UpdateUserUsdt
 * @name: UserUsdtUpdateReq
 */
export interface UserUsdtUpdateReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 网络协议
   */
  bankId?: number;
  /**
   * 钱包地址
   */
  accountNo?: string;
  /**
   * 地址别称
   */
  beneficiaryName?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 新增会员钱包 (Auth) 请求
 * @url: /api/v1/Users/AddUserWallet
 * @name: UserWalletAddReq
 */
export interface UserWalletAddReq {
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 钱包类型
   */
  bankId?: number;
  /**
   * 姓名
   */
  beneficiaryName?: string;
  /**
   * 账号
   */
  accountNo?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 删除会员钱包 (Auth) 请求
 * @url: /api/v1/Users/DeleteUserWallet
 * @name: UserWalletDeleteReq
 */
export interface UserWalletDeleteReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 商户Id
   */
  tenantId?: number;
}

/**
 * @description: 获取会员钱包信息列表（银行卡/电子钱包/UPI/NEWUPI/USDT，含银行名称） (Auth) 响应
 * @url: /api/v1/Users/GetUserWalletInfo
 * @name: UserWalletInfoRsp
 */
export interface UserWalletInfoRsp {
  /**
   * 银行卡列表（WithType=1）
   */
  bankCards: WiBankCardRsp[];
  /**
   * 电子钱包列表（WithType=4,6,8,22,23,24）
   */
  wallets: WiEWalletRsp[];
  /**
   * UPI列表（WithType=2）
   */
  upiList: WiUpiRsp[];
  /**
   * NEWUPI列表（WithType=20）
   */
  newUpiList: WiNewUpiRsp[];
  /**
   * USDT列表（WithType=3,10）
   */
  usdtList: WiUsdtRsp[];
}

export type UserWalletInfoRspApiResponse = UserWalletInfoRsp;

export interface UserWalletPageRsp {
  /**
   * 
   */
  tenantId: number;
  /**
   * 主键ID
   */
  bId: number;
  /**
   * 
   */
  userId: number;
  /**
   * 
   */
  withType: number;
  /**
   * 
   */
  bankId: number;
  /**
   * 
   */
  bankNameStr: string;
  /**
   * 
   */
  beneficiaryName: string;
  /**
   * 
   */
  phoneOrAccount: string;
  /**
   * 
   */
  address: string;
  /**
   * 
   */
  addTime: string;
  /**
   * 
   */
  updateTime: string;
  /**
   * 
   */
  lastUpdateOperator: string;
}

/**
 * @description: 分页获取会员钱包列表 (Auth) 响应
 * @url: /api/v1/Users/GetUserWalletPageList
 * @name: UserWalletPageRspListPageBaseResponse
 */
export interface UserWalletPageRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: UserWalletPageRsp[];
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

export type UserWalletPageRspListPageBaseResponseApiResponse = UserWalletPageRspListPageBaseResponse;

/**
 * @description: 编辑会员钱包 (Auth) 请求
 * @url: /api/v1/Users/UpdateUserWallet
 * @name: UserWalletUpdateReq
 */
export interface UserWalletUpdateReq {
  /**
   * 主键ID
   */
  bId?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 钱包类型
   */
  bankId?: number;
  /**
   * 姓名
   */
  beneficiaryName?: string;
  /**
   * 账号
   */
  accountNo?: string;
  /**
   * 商户Id
   */
  tenantId?: number;
}

export interface UserWithdrawInfo {
  /**
   * 提现时间
   */
  upTime?: string;
  /**
   * 提现金额
   */
  price?: number;
  /**
   * 本次打码倍数
   */
  thisCodingAmount?: number;
  /**
   * 提现方式类型
   */
  type?: string;
  /**
   * 提现通道ID
   */
  withdrawTypeId?: number;
}

/**
 * @description: 分页获取前台日志列表 (Auth) 请求
 * @url: /api/v1/System/GetWebLogPageList
 * @name: WebLogReq
 */
export interface WebLogReq {
  /**
   * 日志类型（1=登录日志，2=操作日志）
   */
  logType?: number;
  /**
   * 日志状态（0=失败，1=成功）
   */
  logState?: number;
  /**
   * 会员ID
   */
  userId?: number;
  /**
   * 关键字（搜索日志标题、用户名、页面名称、日志内容）
   */
  keyWords?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
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

export interface WebLogRsp {
  /**
   * 日志ID
   */
  logID: number;
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 日志标题
   */
  logTitle: string;
  /**
   * 操作用户
   */
  userName: string;
  /**
   * 客户端IP
   */
  userIP: string;
  /**
   * IP所在地
   */
  userIPArea: string;
  /**
   * 操作系统
   */
  userOS: string;
  /**
   * 浏览器类型
   */
  userIE: string;
  /**
   * 日志时间（yyyy-MM-dd HH:mm:ss）
   */
  logDateStr: string;
  /**
   * 日志状态（0=失败，1=成功）
   */
  logState: number;
  /**
   * 日志状态文本（成功/失败）
   */
  logStateStr: string;
  /**
   * 日志内容
   */
  logInfo: string;
  /**
   * 日志类型（1=登录日志，2=操作日志）
   */
  logType: number;
  /**
   * 页面名称
   */
  pageName: string;
  /**
   * 页面地址
   */
  pageUrl: string;
  /**
   * 数据ID
   */
  dataID: number;
  /**
   * 数据名称
   */
  dataName: string;
  /**
   * 数据内容
   */
  dataValue: string;
}

/**
 * @description: 分页获取前台日志列表 (Auth) 响应
 * @url: /api/v1/System/GetWebLogPageList
 * @name: WebLogRspListPageBaseResponse
 */
export interface WebLogRspListPageBaseResponse {
  /**
   * 获取 返回数据
   */
  list: WebLogRsp[];
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

export type WebLogRspListPageBaseResponseApiResponse = WebLogRspListPageBaseResponse;

export interface WiBankCardRsp {
  /**
   * 
   */
  bId: number;
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * 持卡人姓名
   */
  beneficiaryName: string;
  /**
   * 卡号
   */
  accountNo: string;
  /**
   * IFSC Code
   */
  ifscCode: string;
  /**
   * 银行名称（由BankCode关联tab_Banks.BankName）
   */
  bankName: string;
  /**
   * 手机号
   */
  mobileNO: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 所在省/银行编号
   */
  bankProvinceCode: string;
  /**
   * 所在市/CPF
   */
  bankCityCode: string;
  /**
   * 支行/支行编号
   */
  bankBranchAddress: string;
}

export interface WiEWalletRsp {
  /**
   * 
   */
  bId: number;
  /**
   * 提现类型
   */
  withType: number;
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * 用户名称
   */
  beneficiaryName: string;
  /**
   * 账号/手机（WithType=6 WavePay 使用AccountNo，其他使用MobileNO）
   */
  phoneOrAccount: string;
  /**
   * 电子钱包名称（由BankCode关联tab_Banks.BankName）
   */
  bankName: string;
}

export interface WiNewUpiRsp {
  /**
   * 
   */
  bId: number;
  /**
   * NEWUPI名称
   */
  beneficiaryName: string;
  /**
   * NEWUPI_ID
   */
  accountNo: string;
  /**
   * 绑定银行卡BID
   */
  relationId: number;
}

export interface WiUpiRsp {
  /**
   * 
   */
  bId: number;
  /**
   * 提现类型
   */
  withType: number;
  /**
   * 提现类型名称
   */
  withTypeName: string;
  /**
   * UPI名称
   */
  beneficiaryName: string;
  /**
   * UPI_ID
   */
  accountNo: string;
  /**
   * 手机号
   */
  mobileNO: string;
}

export interface WiUsdtRsp {
  /**
   * 
   */
  bId: number;
  /**
   * 提现类型（3=USDT，10=USDT2）
   */
  withType: number;
  /**
   * 银行ID
   */
  bankId: number;
  /**
   * USDT类型文本（USDT / USDT2(TB法币)）
   */
  usdtTypeName: string;
  /**
   * 主网络名称（由BankCode关联tab_Banks.BankName）
   */
  bankName: string;
  /**
   * USDT地址
   */
  accountNo: string;
  /**
   * 地址别称
   */
  beneficiaryName: string;
}

export interface XosoBettingTypeRsp {
  /**
   * 玩法父节点类型（对应 XosoTypeParentEnum）
   */
  lotteryType: number;
  /**
   * 投注类型编号
   */
  oddsType: number;
  /**
   * 投注类型名称
   */
  oddsTypeStr: string;
}

/**
 * @description: 解析批量充值Excel文件并做格式、权限、限额预校验（两阶段提交第一步） (Auth) 请求
 * @url: /api/v1/Recharge/InitBatchRechargeFile
 * @name: InitBatchRechargeFileFormDto
 */
export interface InitBatchRechargeFileFormDto {
  /**
   * 商户ID
   */
  TenantId?: number;
  /**
   * Excel文件（.xls / .xlsx，最大4MB）
   */
  File?: string;
}

