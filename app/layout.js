export const metadata = {
    title: 'LeadGen SaaS',
    description: 'Find and export business leads',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  