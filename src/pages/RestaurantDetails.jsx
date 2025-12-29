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
    if (status === 'rejected' && !remarks.trim()) {
        alert("Please provide a reason for rejection.");
        return;
    }
    
    const confirmMsg = status === 'rejected' 
        ? "REJECT and DELETE this application? This cannot be undone."
        : "APPROVE this restaurant?";

    if(!window.confirm(confirmMsg)) return;

    try {
      await api.patch(`/admin/restaurants/${id}/verify`, { verificationStatus: status, remarks });
      alert('Updated successfully');
      navigate('/restaurants');
    } catch (err) { 
        alert(err.response?.data?.message || "Action failed"); 
    }
  };

  const toggleActive = async () => {
    try {
      const newStatus = !data.isActive;
      await api.patch(`/admin/restaurants/${id}/toggle-active`, { isActive: newStatus });
      setData({ ...data, isActive: newStatus });
    } catch (err) { alert("Action failed"); }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-gray-500">Not found</div>;

  const docs = data.documents || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4">
        &larr; Back to list
      </button>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{data.restaurantName}</h1>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${data.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`} 
            onClick={toggleActive}
          >
             {data.isActive ? "Active (Deactivate)" : "Inactive (Activate)"}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
                <p><span className="font-semibold text-gray-500 block">Owner Name</span> {data.ownerFullName}</p>
                <p><span className="font-semibold text-gray-500 block">Email</span> {data.email}</p>
                <p><span className="font-semibold text-gray-500 block">Phone</span> {data.phoneNumber}</p>
            </div>
            <div className="space-y-3">
                <p><span className="font-semibold text-gray-500 block">Address</span> {data.address?.fullAddress || 'N/A'}</p>
                <p><span className="font-semibold text-gray-500 block">Type</span> {data.restaurantType}</p>
                <p><span className="font-semibold text-gray-500 block">Status</span> 
                   <span className={`inline-block px-2 py-0.5 rounded text-xs uppercase font-bold ml-1 ${data.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                     {data.isEmailVerified ? 'Approved' : 'Pending'}
                   </span>
                </p>
            </div>
        </div>

        <div className="my-8 border-t border-gray-100" />

        <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { label: 'Business License', url: docs.businessLicense?.imageUrl },
                { label: 'Food Hygiene', url: docs.foodHygieneCertificate?.imageUrl },
                { label: 'VAT Certificate', url: docs.vatCertificate?.imageUrl },
                { label: 'Bank Details', url: docs.bankDetails?.bankDetailsImageUrl }
            ].map((doc, idx) => (
                <div key={idx} className="border border-gray-200 p-4 rounded-xl">
                    <p className="font-semibold text-sm mb-2">{doc.label}</p>
                    {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noreferrer">
                            <img src={doc.url} alt={doc.label} className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition-opacity" />
                        </a>
                    ) : <p className="text-red-500 text-xs italic">Not Uploaded</p>}
                </div>
            ))}
        </div>

        {/* CONDITION CHANGED: Show buttons if NOT verified */}
        {!data.isEmailVerified && (
            <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Verification Decision</h3>
                <p className="text-xs text-slate-500 mb-3">
                   <strong>Approve:</strong> Enables login and activates restaurant.<br/>
                   <strong>Reject:</strong> Sends email with reason and permanently deletes application.
                </p>
                <textarea 
                    placeholder="Enter reason for rejection (required) or approval notes (optional)..." 
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    rows="3"
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                ></textarea>
                <div className="flex gap-4">
                    <button onClick={() => handleVerification('approved')} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                        Approve & Activate
                    </button>
                    <button onClick={() => handleVerification('rejected')} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                        Reject & Delete
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default RestaurantDetails;