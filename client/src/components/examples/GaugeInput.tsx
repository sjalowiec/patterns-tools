import GaugeInput from '../GaugeInput'

export default function GaugeInputExample() {
  const handleGaugeChange = (gaugeData: any) => {
    console.log('Gauge data:', gaugeData);
  };

  return <GaugeInput onGaugeChange={handleGaugeChange} />
}