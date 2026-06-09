export const navigateTo = (url: string) => uni.navigateTo({ url })
export const redirectTo = (url: string) => uni.redirectTo({ url })
export const switchHome  = () => uni.reLaunch({ url: '/pages/discover/index' })
