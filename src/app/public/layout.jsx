export const metadata = {
  title: 'Document Viewer',
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

export default function PublicDocumentLayout({ children }) {
  return children;
}
