import Foundation
import ScreenSaver
import WebKit
import os.log

class October30View: ScreenSaverView, WKNavigationDelegate {
  public var backgroundColor = NSColor(calibratedWhite: 0.97, alpha: 1)
  var webView = WKWebView(frame: .zero)

  convenience init() {
    self.init(frame: .zero, isPreview: false)
    initialize()
  }

  override init!(frame: NSRect, isPreview: Bool) {
    super.init(frame: frame, isPreview: isPreview)
    initialize()
  }

  required public init?(coder: NSCoder) {
    super.init(coder: coder)
    initialize()
  }

  override var configureSheet: NSWindow? {
    return nil
  }

  override var hasConfigureSheet: Bool {
    return false
  }

  override func animateOneFrame() {
    // null
  }

  override func draw(_ rect: NSRect) {
    super.draw(rect)
    backgroundColor.setFill()
    rect.fill()
  }

  private func initialize() {
    animationTimeInterval = 0.5

    let webConfiguration = WKWebViewConfiguration()
    webConfiguration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

    var x: CGFloat = 0
    var y: CGFloat = 0
    var w: CGFloat = 712
    var h: CGFloat = 528
    if (frame.width > 800 && frame.height > 600) {
      x = (frame.width - w) / 2
      y = (frame.height - h) / 2 + 24
    } else {
      w = 237
      h = 176
      x = (frame.width - w) / 2
      y = (frame.height - h) / 2 + 2
    }

    webView = WKWebView(frame: NSRect(x: x, y: y, width: w, height: h),
                        configuration: webConfiguration)

    webView.navigationDelegate = self
    webView.setValue(false, forKey: "drawsBackground")
    webView.allowsBackForwardNavigationGestures = false
    webView.allowsMagnification = false
    webView.alphaValue = 0

    addSubview(webView)
    webView.layer?.backgroundColor = NSColor(calibratedWhite: 0.97, alpha: 1).cgColor

    if let htmlPath = Bundle(for: type(of: self)).path(forResource: "html", ofType: nil) {
      let htmlUrl = URL(fileURLWithPath: htmlPath, isDirectory: true)
      let indexUrl = URL(fileURLWithPath: htmlPath + "/index.html", isDirectory: false)
      webView.loadFileURL(indexUrl, allowingReadAccessTo: htmlUrl)
    }
  }

  func webView(_ webView: WKWebView,
               didFinish navigation: WKNavigation!) {
    webView.alphaValue = 1
  }
}
