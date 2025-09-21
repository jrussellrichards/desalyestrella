import type { FC, ReactElement } from 'react'
import {
  IconListDetails,
  IconStar,
  IconShieldCancel,
  IconMapPinHeart,
  IconReceipt2,
  IconHeadset,
  IconBed,
  IconCheck
} from '@tabler/icons-react'

const cls = 'h-5 w-5 flex-shrink-0 stroke-current'

export type FeatureName =
  | 'curation'
  | 'superhost'
  | 'cancel'
  | 'experiences'
  | 'transparent'
  | 'support'
  | 'rest'
  | 'check'

const dict: Record<FeatureName, ReactElement> = {
  curation: <IconListDetails className={cls} stroke={2} />,
  superhost: <IconStar className={cls} stroke={2} />,
  cancel: <IconShieldCancel className={cls} stroke={2} />,
  experiences: <IconMapPinHeart className={cls} stroke={2} />,
  transparent: <IconReceipt2 className={cls} stroke={2} />,
  support: <IconHeadset className={cls} stroke={2} />,
  rest: <IconBed className={cls} stroke={2} />,
  check: <IconCheck className={cls} stroke={2} />
}

export const FeatureIcon: FC<{ name: FeatureName }> = ({ name }) =>
  dict[name] || dict.check