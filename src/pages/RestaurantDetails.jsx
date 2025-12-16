import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    api.get(`/admin/restaurants/${id}`)
      .then(res => setData(res.data.data))
      .catch(() => alert("Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVerification = async (status) => {
    if(!window.confirm(`Confirm ${status}?`)) return;
    try {
      await api.patch(`/admin/restaurants/${id}/verify`, { verificationStatus: status, remarks });
      alert('Updated successfully');
      navigate('/restaurants');
    } catch (err) { alert("Action failed"); }
  };

  const toggleActive = async () => {
    try {
      const newStatus = !data.isActive;
      await api.patch(`/admin/restaurants/${id}/toggle-active`, { isActive: newStatus });
      setData({ ...data, isActive: newStatus });
    } catch (err) { alert("Action failed"); }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (!data) return <div className="card">Not found</div>;

  const docs = data.documents || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '20px' }}>&larr; Back</button>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <h1>{data.restaurantName}</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button className={data.isActive ? "btn btn-success" : "btn btn-danger"} onClick={toggleActive}>
                {data.isActive ? "Active (Click to Deactivate)" : "Inactive (Click to Activate)"}
             </button>
          </div>
        </div>
        
        <div className="grid-cols-1 grid-cols-2" style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            <div>
                <p><strong>Owner:</strong> {data.ownerFullName}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Phone:</strong> {data.phoneNumber}</p>
            </div>
            <div>
                <p><strong>Address:</strong> {data.address?.fullAddress || 'N/A'}</p>
                <p><strong>Type:</strong> {data.restaurantType}</p>
                <p><strong>Status:</strong> <span className={`badge ${docs.verificationStatus}`}>{docs.verificationStatus}</span></p>
            </div>
        </div>

        <hr style={{ margin: '20px 0', borderTop: '1px solid #e2e8f0' }} />

        <h3>Verification Documents</h3>
        <div className="grid-cols-1 grid-cols-2" style={{ display: 'grid', gap: '20px' }}>
            {[
                { label: 'Business License', url: docs.businessLicense?.imageUrl },
                { label: 'Food Hygiene', url: docs.foodHygieneCertificate?.imageUrl },
                { label: 'VAT Certificate', url: docs.vatCertificate?.imageUrl },
                { label: 'Bank Details', url: docs.bankDetails?.bankDetailsImageUrl }
            ].map((doc, idx) => (
                <div key={idx} style={{ border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
                    <p style={{ fontWeight: 600 }}>{doc.label}</p>
                    {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer">
                            <img src={doc.url} alt={doc.label} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                        </a>
                    ) : <p style={{ color: 'red' }}>Not Uploaded</p>}
                </div>
            ))}
        </div>

        {docs.verificationStatus === 'pending' && (
            <div style={{ marginTop: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
                <h3>Action Required</h3>
                <textarea 
                    placeholder="Add remarks (optional for rejection)" 
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows="3"
                ></textarea>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => handleVerification('approved')} className="btn btn-success" style={{ flex: 1 }}>Approve</button>
                    <button onClick={() => handleVerification('rejected')} className="btn btn-danger" style={{ flex: 1 }}>Reject</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default RestaurantDetails;