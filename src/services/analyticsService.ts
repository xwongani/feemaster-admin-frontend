import { analyticsApi } from './api';

export interface AnalyticsEvent {
  event_type: string;
  event_name: string;
  user_id?: string;
  user_email?: string;
  session_id: string;
  timestamp: string;
  user_agent: string;
  page_url: string;
  referrer_url?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
}

export interface PageViewEvent extends AnalyticsEvent {
  event_type: 'page_view';
  page_title: string;
  page_category?: string;
  time_on_page?: number;
}

export interface UserActionEvent extends AnalyticsEvent {
  event_type: 'user_action';
  action_type: 'click' | 'submit' | 'scroll' | 'hover' | 'focus' | 'blur';
  element_type: string;
  element_id?: string;
  element_text?: string;
  form_name?: string;
  success?: boolean;
}

export interface ErrorEvent extends AnalyticsEvent {
  event_type: 'error';
  error_type: 'javascript' | 'network' | 'validation' | 'api';
  error_message: string;
  error_stack?: string;
  component_name?: string;
}

export interface PerformanceEvent extends AnalyticsEvent {
  event_type: 'performance';
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
}

class AnalyticsService {
  private sessionId: string;
  private startTime: number;
  private pageStartTime: number;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageStartTime = Date.now();
    this.initialize();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initialize() {
    if (this.isInitialized) return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackPageView('page_hidden');
      } else {
        this.trackPageView('page_visible');
      }
    });

    // Track performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.trackPerformance();
        }, 1000);
      });
    }

    // Track errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript', event.error?.message || event.message, event.error?.stack);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('javascript', event.reason?.message || 'Unhandled Promise Rejection', event.reason?.stack);
    });

    this.isInitialized = true;
  }

  private getBaseEvent(): Omit<AnalyticsEvent, 'event_type' | 'event_name'> {
    return {
      user_id: this.getUserId(),
      user_email: this.getUserEmail(),
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      referrer_url: document.referrer,
      ip_address: 'client-side', // Will be captured by backend
    };
  }

  private getUserId(): string | undefined {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id;
    } catch {
      return undefined;
    }
  }

  private getUserEmail(): string | undefined {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.email;
    } catch {
      return undefined;
    }
  }

  async trackPageView(pageName: string, metadata?: Record<string, any>) {
    const timeOnPage = Date.now() - this.pageStartTime;
    this.pageStartTime = Date.now();

    const event: PageViewEvent = {
      ...this.getBaseEvent(),
      event_type: 'page_view',
      event_name: pageName,
      page_title: document.title,
      page_category: this.getPageCategory(),
      time_on_page: timeOnPage,
      metadata,
    };

    try {
      await analyticsApi.logRouteChange({
        path: window.location.pathname,
        search: window.location.search,
        user_id: event.user_id,
        user_email: event.user_email,
        timestamp: event.timestamp,
        user_agent: event.user_agent,
        referrer: event.referrer_url || '',
      });
    } catch (error) {
      console.debug('Page view tracking failed:', error);
    }
  }

  async trackUserAction(
    actionType: UserActionEvent['action_type'],
    elementType: string,
    elementId?: string,
    elementText?: string,
    metadata?: Record<string, any>
  ) {
    const event: UserActionEvent = {
      ...this.getBaseEvent(),
      event_type: 'user_action',
      event_name: `${actionType}_${elementType}`,
      action_type: actionType,
      element_type: elementType,
      element_id: elementId,
      element_text: elementText,
      metadata,
    };

    try {
      await analyticsApi.logAction({
        action: actionType,
        resource: elementType,
        resource_id: elementId,
        details: { element_text: elementText, ...metadata },
        user_id: event.user_id,
        user_email: event.user_email,
        timestamp: event.timestamp,
        user_agent: event.user_agent,
      });
    } catch (error) {
      console.debug('User action tracking failed:', error);
    }
  }

  async trackFormSubmit(
    formName: string,
    success: boolean,
    metadata?: Record<string, any>
  ) {
    const event: UserActionEvent = {
      ...this.getBaseEvent(),
      event_type: 'user_action',
      event_name: `form_submit_${formName}`,
      action_type: 'submit',
      element_type: 'form',
      element_id: formName,
      form_name: formName,
      success,
      metadata,
    };

    try {
      await analyticsApi.logAction({
        action: 'submit',
        resource: 'form',
        resource_id: formName,
        details: { success, ...metadata },
        user_id: event.user_id,
        user_email: event.user_email,
        timestamp: event.timestamp,
        user_agent: event.user_agent,
      });
    } catch (error) {
      console.debug('Form submit tracking failed:', error);
    }
  }

  async trackError(
    errorType: ErrorEvent['error_type'],
    errorMessage: string,
    errorStack?: string,
    componentName?: string
  ) {
    const event: ErrorEvent = {
      ...this.getBaseEvent(),
      event_type: 'error',
      event_name: `error_${errorType}`,
      error_type: errorType,
      error_message: errorMessage,
      error_stack: errorStack,
      component_name: componentName,
    };

    try {
      await analyticsApi.logAction({
        action: 'error',
        resource: 'system',
        details: {
          error_type: errorType,
          error_message: errorMessage,
          error_stack: errorStack,
          component_name: componentName,
        },
        user_id: event.user_id,
        user_email: event.user_email,
        timestamp: event.timestamp,
        user_agent: event.user_agent,
      });
    } catch (error) {
      console.debug('Error tracking failed:', error);
    }
  }

  async trackPerformance() {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const metrics = [
      { name: 'dom_content_loaded', value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart },
      { name: 'load_complete', value: navigation.loadEventEnd - navigation.loadEventStart },
      { name: 'first_paint', value: 0 }, // Would need PerformanceObserver for this
      { name: 'first_contentful_paint', value: 0 }, // Would need PerformanceObserver for this
    ];

    for (const metric of metrics) {
      if (metric.value > 0) {
        const event: PerformanceEvent = {
          ...this.getBaseEvent(),
          event_type: 'performance',
          event_name: `performance_${metric.name}`,
          metric_name: metric.name,
          metric_value: metric.value,
          metric_unit: 'ms',
        };

        try {
          await analyticsApi.logAction({
            action: 'performance',
            resource: 'page',
            details: {
              metric_name: metric.name,
              metric_value: metric.value,
              metric_unit: 'ms',
            },
            user_id: event.user_id,
            user_email: event.user_email,
            timestamp: event.timestamp,
            user_agent: event.user_agent,
          });
        } catch (error) {
          console.debug('Performance tracking failed:', error);
        }
      }
    }
  }

  private getPageCategory(): string {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/students')) return 'students';
    if (path.startsWith('/payments')) return 'payments';
    if (path.startsWith('/reports')) return 'reports';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/login')) return 'auth';
    return 'other';
  }

  // Convenience methods for common tracking scenarios
  async trackButtonClick(buttonName: string, context?: Record<string, any>) {
    await this.trackUserAction('click', 'button', undefined, buttonName, context);
  }

  async trackLinkClick(linkText: string, linkUrl?: string) {
    await this.trackUserAction('click', 'link', undefined, linkText, { link_url: linkUrl });
  }

  async trackInputFocus(fieldName: string, fieldType: string) {
    await this.trackUserAction('focus', 'input', fieldName, fieldType);
  }

  async trackScroll(direction: 'up' | 'down', scrollDepth: number) {
    await this.trackUserAction('scroll', 'page', undefined, direction, { scroll_depth: scrollDepth });
  }

  // Session management
  getSessionId(): string {
    return this.sessionId;
  }

  getSessionDuration(): number {
    return Date.now() - this.startTime;
  }

  // Batch tracking for performance
  private batchEvents: AnalyticsEvent[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  private addToBatch(event: AnalyticsEvent) {
    this.batchEvents.push(event);
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.flushBatch();
    }, 5000); // Flush every 5 seconds
  }

  private async flushBatch() {
    if (this.batchEvents.length === 0) return;

    const events = [...this.batchEvents];
    this.batchEvents = [];

    try {
      // Send batch to backend
      await analyticsApi.logAction({
        action: 'batch_events',
        resource: 'analytics',
        details: { events },
        user_id: this.getUserId(),
        user_email: this.getUserEmail(),
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.debug('Batch tracking failed:', error);
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService; 