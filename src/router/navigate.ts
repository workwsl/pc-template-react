import type { NavigateFunction, NavigateOptions, To } from 'react-router-dom'

let _navigate: NavigateFunction | null = null

/**
 * 在 App 初始化时注入 navigate 实例
 */
export function setNavigate(fn: NavigateFunction) {
  _navigate = fn
}

/**
 * 在任意地方调用进行跳转
 * @example navigate('/home')
 * @example navigate(-1)
 */
// export function navigate(to: number): void
// export function navigate(to: To, options?: NavigateOptions): void
export function navigate(to: To | number, options?: NavigateOptions): void {
  if (!_navigate) {
    console.warn('⚠️ navigate() called before router initialized')
    return
  }
  if (typeof to === 'number') {
    _navigate(to)
  } else {
    _navigate(to, options)
  }
}
