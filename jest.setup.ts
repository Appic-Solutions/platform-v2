import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.defineProperty(global, 'TextEncoder', { value: TextEncoder, writable: true });

Object.defineProperty(global, 'TextDecoder', { value: TextDecoder, writable: true });

// Polyfill TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string): string | null => localStorageMock.store[key] || null),
  setItem: jest.fn((key: string, value: string): void => {
    localStorageMock.store[key] = value.toString();
  }),
  clear: jest.fn((): void => {
    localStorageMock.store = {};
  }),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });
