import type { RuleSet } from 'styled-components';

import type { Expandable } from '~ui/shared/types';

export const expandedStyle = (style: RuleSet) => (props: Expandable) => {
  return props.$expanded ? style : {};
};
