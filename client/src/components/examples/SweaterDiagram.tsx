import SweaterDiagram from '../SweaterDiagram'

export default function SweaterDiagramExample() {
  return (
    <SweaterDiagram 
      castOnStitches={55}
      necklineStitches={28}
      preNeckRows={38}
      necklineRows={30}
      units="inches"
    />
  )
}