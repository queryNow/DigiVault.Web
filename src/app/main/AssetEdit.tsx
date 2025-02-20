import { useParams, useNavigate } from 'react-router-dom';
import { useAssetStore } from '../../utils/store/assets';
import AssetEditForm from '../../core/components/AssetEditForm';

export default function AssetEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAssetById } = useAssetStore();
  const asset = getAssetById(id || '');

  if (!asset) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Asset not found</p>
          <button
            onClick={() => navigate('/assets')}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            Return to Asset Management
          </button>
        </div>
      </div>
    );
  }

  return <AssetEditForm asset={asset} mode="edit" />;
}