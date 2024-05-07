import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

type Props = {
  checked: boolean,
  changeHandler: (value:boolean) => void,
}
function AutoRefreshSwitch({ checked, changeHandler }: Props) {
  return (
    <div className="flex items-center space-x-2 lg:py-4 py-0">
      <Switch id="auto-refresh" checked={checked} onCheckedChange={changeHandler}/>
      <Label htmlFor="auto-refresh">Auto-refresh</Label>
    </div>
  )
}

export default AutoRefreshSwitch;
