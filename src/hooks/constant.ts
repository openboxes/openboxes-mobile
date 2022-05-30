export const LISTENER = {
  BROADCAST_INTENT: 'datawedge_broadcast_intent',
  BARCODE_SCAN: 'barcode_scan',
  ENUMERATED_SCANNER: 'enumerated_scanners'
};
export const FILTER_ACTIONS = [
  'com.openboxes.android.ACTION',
  'com.symbol.datawedge.api.RESULT_ACTION'
];

export const FILTER_CATEGORY = ['android.intent.category.DEFAULT'];

export const ACTION = {
  API_ACTION: 'com.symbol.datawedge.api.ACTION',
  DATA_STRING: 'com.symbol.datawedge.data_string',
  LABEL_TYPE: 'com.symbol.datawedge.label_type'
};
export const PROPERTY = {
  RESULT_INFO: 'RESULT_INFO',
  VERSION_INFO: 'com.symbol.datawedge.api.RESULT_GET_VERSION_INFO',
  DATAWEDGE: 'DATAWEDGE',
  RESULT_ENUMERATED_SCANNER:
    'com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS',
  ACTIVE_PROFILE: 'com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'
};

export const VERSION = {
  V06_3: '06.3',
  V06_4: '06.4',
  V06_5: '06.5'
};

export const PROFILE = {
  NAME: 'OPENBOXES',
  CREATE_PROFILE: 'com.symbol.datawedge.api.CREATE_PROFILE',
  ACTIVE_PROFILE: 'com.symbol.datawedge.api.GET_ACTIVE_PROFILE',
  ENUMERATE_PROFILE: 'com.symbol.datawedge.api.ENUMERATE_SCANNERS',
  SET_CONFIG_PROFILE: 'com.symbol.datawedge.api.SET_CONFIG'
};

export const PROFILE_CONFIG = {
  PROFILE_NAME: 'OPENBOXES',
  PROFILE_ENABLED: 'true',
  CONFIG_MODE: 'UPDATE',
  PLUGIN_CONFIG: {
    PLUGIN_NAME: 'BARCODE',
    RESET_CONFIG: 'true',
    PARAM_LIST: {}
  },
  APP_LIST: [
    {
      PACKAGE_NAME: 'com.openboxes.android',
      ACTIVITY_LIST: ['*']
    }
  ]
};
export const PROFILE_CONFIG2 = {
  PROFILE_NAME: 'OPENBOXES',
  PROFILE_ENABLED: 'true',
  CONFIG_MODE: 'UPDATE',
  PLUGIN_CONFIG: {
    PLUGIN_NAME: 'INTENT',
    RESET_CONFIG: 'true',
    PARAM_LIST: {
      intent_output_enabled: 'true',
      intent_action: 'com.openboxes.android.ACTION',
      intent_delivery: '2'
    }
  }
};
