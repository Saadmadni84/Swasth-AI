import { useState } from 'react';

const ParkinsonsForm = () => {
  const [formData, setFormData] = useState({
    fo: '',
    fhi: '',
    flo: '',
    jitter_percent: '',
    shimmer: '',
    nhr: '',
    hnr: ''
  });
  
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );
      
      const response = await fetch('/api/predict/parkinsons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Prediction error:', error);
      setError(error.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { 
      name: 'fo', 
      label: 'Average vocal fundamental frequency (Hz)', 
      type: 'number', 
      step: '0.001', 
      min: '0',
      description: 'MDVP:Fo(Hz) - Average vocal fundamental frequency'
    },
    { 
      name: 'fhi', 
      label: 'Maximum vocal fundamental frequency (Hz)', 
      type: 'number', 
      step: '0.001', 
      min: '0',
      description: 'MDVP:Fhi(Hz) - Maximum vocal fundamental frequency'
    },
    { 
      name: 'flo', 
      label: 'Minimum vocal fundamental frequency (Hz)', 
      type: 'number', 
      step: '0.001', 
      min: '0',
      description: 'MDVP:Flo(Hz) - Minimum vocal fundamental frequency'
    },
    { 
      name: 'jitter_percent', 
      label: 'Jitter (%)', 
      type: 'number', 
      step: '0.000001', 
      min: '0',
      description: 'MDVP:Jitter(%) - Measures of variation in fundamental frequency'
    },
    { 
      name: 'shimmer', 
      label: 'Shimmer', 
      type: 'number', 
      step: '0.0001', 
      min: '0',
      description: 'MDVP:Shimmer - Measures of variation in amplitude'
    },
    { 
      name: 'nhr', 
      label: 'Noise-to-harmonics ratio (NHR)', 
      type: 'number', 
      step: '0.000001', 
      min: '0',
      description: 'NHR - Measures of ratio of noise to tonal components in the voice'
    },
    { 
      name: 'hnr', 
      label: 'Harmonics-to-noise ratio (HNR)', 
      type: 'number', 
      step: '0.01', 
      min: '0',
      description: 'HNR - Measures of ratio of noise to tonal components in the voice'
    }
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Parkinson's Disease Risk Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label 
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                step={field.step}
                min={field.min}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {field.description && (
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Predicting...' : 'Predict Parkinson\'s Disease Risk'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {result && (
        <div className={`mt-6 p-6 rounded-lg ${(result.prediction === 'Parkinsons' || result.prediction === 1 || result.prediction_value === 1) ? 'bg-red-50 border-l-4 border-red-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {(result.prediction === 'Parkinsons' || result.prediction === 1 || result.prediction_value === 1) ? (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                {(result.prediction === 'Parkinsons' || result.prediction === 1 || result.prediction_value === 1) ? 'High Risk of Parkinson\'s Disease' : 'Low Risk of Parkinson\'s Disease'}
              </h3>
              <div className="mt-2 text-sm">
                <p>
                  {(result.prediction === 'Parkinsons' || result.prediction === 1 || result.prediction_value === 1)
                    ? 'The model predicts a high risk of Parkinson\'s disease based on the provided voice measurements. Please consult with a healthcare professional for further evaluation.'
                    : 'The model predicts a low risk of Parkinson\'s disease based on the provided voice measurements.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkinsonsForm;
