import test from 'ava';
import mock from './mocks/mock';

test('test the mock', t => {
  t.is(mock(1, 2), 6);
});

test('test the mock rewire', t => {
  mock.__Rewire__('c', 4);
  t.is(mock(1, 2), 7);
  mock.__ResetDependency__('c');
});

test('test the mock', t => {
  t.is(mock(1, 2), 6);
});
