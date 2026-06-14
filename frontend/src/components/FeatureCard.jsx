const FeatureCard = ({ icon, title, description }) => {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.3s ease',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1rem'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      <div style={{ 
        background: '#eff6ff', 
        padding: '1rem', 
        borderRadius: 'var(--radius-md)',
        color: 'var(--primary)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
};

export default FeatureCard;
