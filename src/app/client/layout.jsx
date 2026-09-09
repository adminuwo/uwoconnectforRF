export const metadata = {
  title: 'Client Workspace',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ClientLayout({ children }) {
  return children;
}
