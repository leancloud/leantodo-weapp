const systemInfo = wx.getSystemInfoSync();
export const isQQApp = systemInfo && systemInfo.AppPlatform === "qq";
