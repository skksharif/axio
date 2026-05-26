export const transitions = {
  fast:   'all 0.15s ease',
  base:   'all 0.2s ease',
  medium: 'all 0.25s ease',
  slow:   'all 0.35s ease',
  spring: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',

  duration: {
    fast:   150,
    base:   200,
    medium: 250,
    slow:   350,
  },

  easing: {
    ease:        'ease',
    easeIn:      'ease-in',
    easeOut:     'ease-out',
    easeInOut:   'ease-in-out',
    spring:      'cubic-bezier(0.34, 1.56, 0.64, 1)',
    sharp:       'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};
