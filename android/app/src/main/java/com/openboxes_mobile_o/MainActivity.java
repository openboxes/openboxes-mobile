package com.openboxes.android;

import android.os.Bundle;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  // React Native Screens lifecycle fix
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // ✅ Prevent "Screen fragments should never be restored"
    if (savedInstanceState != null) {
      savedInstanceState.remove("android:support:fragments");
    }
    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "openboxes_mobile_o";
  }
}
