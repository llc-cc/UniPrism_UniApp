<script>
import { cleanupStaleAuthState, ensureAppAccess, setupAuthNavigationGuard } from './business/auth-guard'
import { api } from './utils/api'

export default {
  onLaunch() {
    api.initApiConfig()
    cleanupStaleAuthState()
    setupAuthNavigationGuard()
  },
  onShow() {
    ensureAppAccess()
  },
}
</script>

<style>
page { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; color: #1a2e2b; }
</style>
