//
//  SafariWebExtensionHandler.swift
//  vocab extension Extension
//
//  Created by Maddy Ludes on 9/18/25.
//

import SafariServices
import os.log

//let SFExtensionMessageKey = "message"
//
//enum SafariExtensionRequestEnum: String {
//    case requestEnabledStatus = "request:enabled_status"
//}
//
//enum SafariExtensionDeliveryEnum: String {
//    case deliveryEnabledStatus = "delivery:enabled_status"
//}

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

//    private let suiteKeyStore = UserDefaults(suiteName: "group.thisisatest")
    
    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        let message: Any?
        if #available(iOS 15.0, macOS 11.0, *) {
            message = request?.userInfo?[SFExtensionMessageKey]
        } else {
            message = request?.userInfo?["message"]
        }

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")

        let response = NSExtensionItem()
        if #available(iOS 15.0, macOS 11.0, *) {
//            response.userInfo = [ SFExtensionMessageKey: [ "echo": message ] ]
//            switch request {
//            case SafariExtensionRequestEnum.requestEnabledStatus:
//                let keyName = "user_defaults_suite_enabled"
//                let enabledFromDefaults = suiteKeyStore?.bool(forKey: keyName) ?? false
//                    response.userInfo = [
//                        SFExtensionMessageKey : [
//                            SafariExtensionDeliveryEnum.deliveryEnabledStatus.rawValue: enabledFromDefaults
//                        ]
//                    ]
//            }
        } else {
            response.userInfo = [ "message": [ "echo": message ] ]
        }

        context.completeRequest(returningItems: [ response ], completionHandler: nil)
    }

}
