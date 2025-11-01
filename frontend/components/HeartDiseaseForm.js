import { useState } from 'react';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await fetch('/api/predict/heart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    'age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal'
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f}>
              <label htmlFor={f} className="block text-sm font-medium text-gray-700">{f}</label>
              <input
                type="number"
                id={f}
                name={f}
                value={formData[f]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isLoading ? 'Predicting...' : 'Predict Heart Disease Risk'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {result && <p className={`mt-4 font-semibold ${result === 'Heart Disease' ? 'text-red-600' : 'text-green-600'}`}>{result}</p>}
    </div>
  );
};

export default HeartDiseaseForm;
