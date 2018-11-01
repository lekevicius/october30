//
//  AppDelegate.swift
//  October30Debug
//
//  Created by Jonas Lekevicius on 2018-10-30
//  Copyright © 2018 Jonas Lekevicius. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
//    var screenSaverView: October30View

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        guard
            let window = NSApplication.shared.mainWindow
        else {
            preconditionFailure()
        }
      let screenSaverView = October30View(frame: window.contentView!.bounds,
                                          isPreview: false)
      if let screenSaverView = screenSaverView {
        screenSaverView.autoresizingMask = [.height, .width]
        window.contentView!.addSubview(screenSaverView);
      }
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }


}

