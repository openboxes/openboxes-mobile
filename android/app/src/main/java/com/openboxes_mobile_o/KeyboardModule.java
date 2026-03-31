package com.openboxes.android;

import android.app.Activity;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class KeyboardModule extends ReactContextBaseJavaModule {

    public KeyboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "KeyboardModule";
    }

    @ReactMethod
    public void showKeyboard() {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final View focusedView = activity.getCurrentFocus();
                if (focusedView == null) {
                    return;
                }

                final InputMethodManager imm = (InputMethodManager)
                        activity.getSystemService(Context.INPUT_METHOD_SERVICE);
                if (imm == null) {
                    return;
                }

                if (focusedView.hasWindowFocus()) {
                    focusedView.post(new Runnable() {
                        @Override
                        public void run() {
                            imm.showSoftInput(focusedView, InputMethodManager.SHOW_IMPLICIT);
                        }
                    });
                } else {
                    final ViewTreeObserver.OnWindowFocusChangeListener[] listenerHolder =
                            new ViewTreeObserver.OnWindowFocusChangeListener[1];

                    listenerHolder[0] = new ViewTreeObserver.OnWindowFocusChangeListener() {
                        @Override
                        public void onWindowFocusChanged(boolean hasFocus) {
                            focusedView.getViewTreeObserver()
                                    .removeOnWindowFocusChangeListener(this);
                            if (hasFocus) {
                                focusedView.post(new Runnable() {
                                    @Override
                                    public void run() {
                                        imm.showSoftInput(focusedView,
                                                InputMethodManager.SHOW_IMPLICIT);
                                    }
                                });
                            }
                        }
                    };

                    focusedView.getViewTreeObserver().addOnWindowFocusChangeListener(listenerHolder[0]);

                    // Clean up listener if the view is detached before window focus arrives
                    focusedView.addOnAttachStateChangeListener(
                            new View.OnAttachStateChangeListener() {
                                @Override
                                public void onViewAttachedToWindow(View v) {}

                                @Override
                                public void onViewDetachedFromWindow(View v) {
                                    focusedView.getViewTreeObserver()
                                            .removeOnWindowFocusChangeListener(listenerHolder[0]);
                                    focusedView.removeOnAttachStateChangeListener(this);
                                }
                            });
                }
            }
        });
    }

    @ReactMethod
    public void hideKeyboard() {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final View focusedView = activity.getCurrentFocus();
                if (focusedView == null) {
                    return;
                }

                final InputMethodManager imm = (InputMethodManager)
                        activity.getSystemService(Context.INPUT_METHOD_SERVICE);
                if (imm != null) {
                    imm.hideSoftInputFromWindow(focusedView.getWindowToken(), 0);
                }
            }
        });
    }
}
