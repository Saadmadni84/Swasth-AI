'use client';
import { useState } from 'react';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
    age:'', sex:'', cp:'', trestbps:'', chol:'', fbs:'', restecg:'', thalach:'', exang:'', oldpeak:'', slope:'', ca:'', thal:''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { const {name,value} = e.target; setFormData(prev=>({...prev,[name]:value})); }
  const handleSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true); setError(''); setResult(null);
    try {
      const numericData = Object.fromEntries(Object.entries(formData).map(([k,v])=>[k,parseFloat(v)||0]));
      const response = await fetch('http://127.0.0.1:5000/predict/heart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(numericData)});
      if(!response.ok) throw new Error('Failed to get prediction');
      const data = await response.json();
      setResult(data.prediction);
    } catch(err){setError(err.message||'Error making prediction');}
    finally{setIsLoading(false);}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="number" name="age" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded"/>
      <input type="number" name="trestbps" placeholder="Resting BP" onChange={handleChange} className="w-full p-2 border rounded"/>
      <input type="number" name="chol" placeholder="Cholesterol" onChange={handleChange} className="w-full p-2 border rounded"/>
      <input type="number" name="thalach" placeholder="Max Heart Rate" onChange={handleChange} className="w-full p-2 border rounded"/>
      <input type="number" name="oldpeak" placeholder="ST Depression" onChange={handleChange} className="w-full p-2 border rounded"/>
      <button type="submit" disabled={isLoading} className="w-full py-2 bg-blue-600 text-white rounded">{isLoading ? 'Predicting...' : 'Predict Heart Disease'}</button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {result && <p className="mt-2 text-green-700">{result}</p>}
    </form>
  );
};

export default HeartDiseaseForm;
