import Image from 'next/image';
import WalletPage from './wallet';
import { cn } from '@/lib/utils';

const HeaderPage = () => {
  return (
    <header className={cn('flex w-full items-center justify-between', 'mb-5 xl:mt-4')}>
      <Image src={'/images/logo/white-logo.png'} alt="logo" width={52} height={43} />
      <WalletPage />
    </header>
  );
};

export default HeaderPage;
