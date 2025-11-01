import { useState } from 'react';

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodpressure: '',
    skinthickness: '',
    insulin: '',
    bmi: '',
    diabetespedigreefunction: '',
    age: ''
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
    setResult(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await fetch('http://127.0.0.1:5000/predict/diabetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setResult(data.prediction); // "Diabetic" or "Not Diabetic"
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'pregnancies', label: 'Pregnancies', type: 'number', step: '1', min: '0' },
    { name: 'glucose', label: 'Glucose (mg/dL)', type: 'number', step: '1', min: '0' },
    { name: 'bloodpressure', label: 'Blood Pressure (mmHg)', type: 'number', step: '1', min: '0' },
    { name: 'skinthickness', label: 'Skin Thickness (mm)', type: 'number', step: '1', min: '0' },
    { name: 'insulin', label: 'Insulin Level (μU/ml)', type: 'number', step: '1', min: '0' },
    { name: 'bmi', label: 'BMI', type: 'number', step: '0.1', min: '0' },
    { name: 'diabetespedigreefunction', label: 'Diabetes Pedigree Function', type: 'number', step: '0.001', min: '0' },
    { name: 'age', label: 'Age', type: 'number', step: '1', min: '0' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
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
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Predicting...' : 'Predict Diabetes Risk'}
        </button>
      </form>

      {error && <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded text-red-700">{error}</div>}

      {result && (
        <div className={`mt-6 p-6 rounded-lg ${result === 'Diabetic' ? 'bg-red-50 border-l-4 border-red-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
          <h3 className="text-sm font-medium">{result}</h3>
          <p className="mt-2 text-sm">
            {result === 'Diabetic'
              ? 'The model predicts a high risk of diabetes. Please consult a healthcare professional.'
              : 'The model predicts a low risk of diabetes. Maintain a healthy lifestyle.'}
          </p>
        </div>
      )}
    </div>
  );
}
