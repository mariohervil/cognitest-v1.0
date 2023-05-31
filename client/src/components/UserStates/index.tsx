import useAuthStore from '@/hooks/useAuthStore';
import { ReactNode } from 'react';

interface SignedInProps {
	children: ReactNode;
}

const SignedIn = ({ children }: SignedInProps) => {
	const session = useAuthStore((state) => state.session);

	if (session) return <>{children}</>;
	else return <></>;
};

const SignedOut = ({ children }: SignedInProps) => {
	const session = useAuthStore((state) => state.session);
	console.log(session);
	if (!session) return <>{children}</>;
	else return <div className="hidden"></div>;
};

const Admin = ({ children }: SignedInProps) => {
	const session = useAuthStore((state) => state.session);

	if (session?.role && session?.role >= 1) return <>{children}</>;
	else return <div className="hidden"></div>;
};

export { SignedIn, SignedOut, Admin };
