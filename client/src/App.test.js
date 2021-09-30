import React from 'react';
import ShowRoom from './content/ShowRoom';
import { shallow } from 'enzyme';

describe('React Step 2 Tests', () => {
  it('renders without crashing', () => {
    shallow(<ShowRoom />);
  });

  const wrapper = shallow(<ShowRoom />);
  it('contains a RepoTable', () => {
    expect(wrapper.find('RepoTable').length).toBe(1);
  });
});
