import { LoadingAvataa } from '6_shared';
import { PropsWithChildren, Suspense } from 'react';

export const SuspenseLoading = ({ children }: PropsWithChildren) => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoadingAvataa />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
