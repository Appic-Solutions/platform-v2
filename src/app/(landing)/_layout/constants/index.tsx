import {
  ArrowsUpDownIcon,
  BlockchainIcon,
  DiscordIcon,
  GithubIcon,
  ParkOutlineBridgeIcon,
  QuestionMarkCircleIcon,
  XIcon,
  YoutubeIcon,
} from '../../_components/icon';
import { FooterNavItems, MenuNavItem, SocialItem } from '../types';

export const NAVBAR_ITEMS: MenuNavItem[] = [
  {
    label: 'Features',
    href: '#Features',
    Icon: <ParkOutlineBridgeIcon className="min-h-5 min-w-5 lg:hidden" />,
  },
  {
    label: 'Tokenomics',
    href: '#Tokenomics',
    Icon: <BlockchainIcon className="min-h-5 min-w-5 lg:hidden" />,
  },
  {
    label: 'Roadmap',
    href: '#Roadmap',
    Icon: <ArrowsUpDownIcon className="min-h-5 min-w-5 lg:hidden" />,
  },
  {
    label: 'FAQ',
    href: '#FAQ',
    Icon: <QuestionMarkCircleIcon className="min-h-5 min-w-5 lg:hidden" />,
  },
];

export const FOOTER_NAV_ITEMS: FooterNavItems[] = [
  {
    title: 'Solutions',
    items: [
      { label: 'Swap', href: '/swap' },
      { label: 'Bridge', href: '/bridge' },
      { label: 'Pools', href: '/positions' },
      { label: 'Twin', href: '/advanced' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Appic Docs (coming soon)', href: null },
      { label: 'Appic SDK (coming soon)', href: null },
      {
        label: 'Investor Deck',
        href: 'https://www.figma.com/slides/3qkLMZLL3uYDNMFTrp2SPk/Appic-Pitch-Deck?node-id=1-1078&t=PEDS7qjRVZrJFA8r-0',
      },
      { label: 'Medium Articles', href: 'https://medium.com/@vibes_12966' },
    ],
  },
];

export const SOCIAL_ITEMS: SocialItem[] = [
  {
    icon: <DiscordIcon className="h-5 w-5 text-[#3870DA]" />,
    href: 'https://discord.com/invite/sHa7SCgEPV',
  },
  {
    icon: <YoutubeIcon className="h-5 w-5 text-[#3870DA]" />,
    href: 'https://youtube.com/@appicdao',
  },
  {
    icon: <XIcon className="h-5 w-5 text-[#3870DA]" />,
    href: 'https://twitter.com/Appic_ICP',
  },
  {
    icon: <GithubIcon className="h-5 w-5 text-[#3870DA]" />,
    href: 'https://github.com/appic-solutions',
  },
];
