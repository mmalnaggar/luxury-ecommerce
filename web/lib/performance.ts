import React from 'react'

export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  loadTime: number
  renderTime: number
  memoryUsage: number
  timestamp: number
}

export interface PerformanceObserver {
  onMetric: (metric: PerformanceMetrics) => void
  onError: (error: Error) => void
}

interface PerformanceWithMemory extends Performance {
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []
  private startTime: number = 0

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMetrics()
    }
  }

  private initializeMetrics() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcp = entries[entries.length - 1]
      this.metrics.fcp = fcp.startTime
      this.logMetric('FCP', fcp.startTime)
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcp = entries[entries.length - 1]
      this.metrics.lcp = lcp.startTime
      this.logMetric('LCP', lcp.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
        if (entry.processingStart && entry.processingStart - entry.startTime > 0) {
          this.metrics.fid = entry.processingStart - entry.startTime
          this.logMetric('FID', this.metrics.fid)
        }
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let cls = 0
      list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
        if (!entry.hadRecentInput) {
          cls += entry.value || 0
        }
      })
      this.metrics.cls = cls
      this.logMetric('CLS', cls)
    }).observe({ entryTypes: ['layout-shift'] })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      this.logMetric('TTFB', this.metrics.ttfb)
    }
  }

  private logMetric(name: string, value: number) {
    console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`)
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: send to Google Analytics, DataDog, etc.
      // gtag('event', 'performance_metric', { metric_name: name, value: value })
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  public measureTime(name: string, fn: () => void | Promise<void>) {
    const start = performance.now()
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start
        console.log(`Performance - ${name}: ${duration.toFixed(2)}ms`)
      })
    } else {
      const duration = performance.now() - start
      console.log(`Performance - ${name}: ${duration.toFixed(2)}ms`)
      return result
    }
  }

  public async measureAsyncTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      console.log(`Performance - ${name}: ${duration.toFixed(2)}ms`)
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.log(`Performance - ${name} (failed): ${duration.toFixed(2)}ms`)
      throw error
    }
  }

  start() {
    this.startTime = performance.now()
  }

  end(): PerformanceMetrics {
    const endTime = performance.now()
    const loadTime = endTime - this.startTime

    const metrics: PerformanceMetrics = {
      fcp: this.metrics.fcp || 0,
      lcp: this.metrics.lcp || 0,
      fid: this.metrics.fid || 0,
      cls: this.metrics.cls || 0,
      ttfb: this.metrics.ttfb || 0,
      loadTime,
      renderTime: endTime - this.startTime,
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now(),
    }

    this.notifyObservers(metrics)
    return metrics
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as PerformanceWithMemory).memory
      return memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
    }
    return 0
  }

  addObserver(observer: PerformanceObserver) {
    this.observers.push(observer)
  }

  removeObserver(observer: PerformanceObserver) {
    const index = this.observers.indexOf(observer)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  private notifyObservers(metrics: PerformanceMetrics) {
    this.observers.forEach(observer => {
      try {
        observer.onMetric(metrics)
      } catch (error) {
        observer.onError(error as Error)
      }
    })
  }
}

export const performanceMonitor = new PerformanceMonitor()

export const measureAsync = async <T>(fn: () => Promise<T>): Promise<{ result: T; metrics: PerformanceMetrics }> => {
  performanceMonitor.start()
  try {
    const result = await fn()
    const metrics = performanceMonitor.end()
    return { result, metrics }
  } catch (error) {
    performanceMonitor.end()
    throw error
  }
}

export const measureSync = <T>(fn: () => T): { result: T; metrics: PerformanceMetrics } => {
  performanceMonitor.start()
  try {
    const result = fn()
    const metrics = performanceMonitor.end()
    return { result, metrics }
  } catch (error) {
    performanceMonitor.end()
    throw error
  }
}

export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    const startTime = performance.now()
    
    const result = React.createElement(Component, props)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Log performance metrics
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
    
    return result
  }
} 