import type { CSS, RuleSet } from 'styled-components/dist/types';

import type { Expandable } from '~popup/types';

export const expandedStyle = (style: RuleSet) => (props: Expandable) => {
  return props.$expanded ? style : {};
};
