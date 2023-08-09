import type { RuleSet } from 'styled-components';

import type { Expandable } from '~player-ui/types';

export const expandedStyle = (style: RuleSet) => (props: Expandable) => {
  return props.$expanded ? style : {};
};
