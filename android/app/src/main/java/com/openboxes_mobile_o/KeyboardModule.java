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
                    final View.OnAttachStateChangeListener[] attachListenerHolder =
                            new View.OnAttachStateChangeListener[1];
                    final ViewTreeObserver.OnWindowFocusChangeListener[] focusListenerHolder =
                            new ViewTreeObserver.OnWindowFocusChangeListener[1];

                    focusListenerHolder[0] = new ViewTreeObserver.OnWindowFocusChangeListener() {
                        @Override
                        public void onWindowFocusChanged(boolean hasFocus) {
                            ViewTreeObserver vto = focusedView.getViewTreeObserver();
                            if (vto.isAlive()) {
                                vto.removeOnWindowFocusChangeListener(this);
                            }
                            focusedView.removeOnAttachStateChangeListener(attachListenerHolder[0]);
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

                    // Clean up focus listener if the view is detached before window focus arrives
                    attachListenerHolder[0] = new View.OnAttachStateChangeListener() {
                        @Override
                        public void onViewAttachedToWindow(View v) {}

                        @Override
                        public void onViewDetachedFromWindow(View v) {
                            ViewTreeObserver vto = focusedView.getViewTreeObserver();
                            if (vto.isAlive()) {
                                vto.removeOnWindowFocusChangeListener(focusListenerHolder[0]);
                            }
                            focusedView.removeOnAttachStateChangeListener(this);
                        }
                    };

                    focusedView.getViewTreeObserver().addOnWindowFocusChangeListener(focusListenerHolder[0]);
                    focusedView.addOnAttachStateChangeListener(attachListenerHolder[0]);
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
