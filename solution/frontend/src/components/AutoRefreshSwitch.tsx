import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

type Props = {
  defaultChecked?: boolean
}
function AutoRefreshSwitch({ defaultChecked }: Props) {
  return (
    <div className="flex items-center space-x-2 p-4">
      <Switch id="auto-refresh" defaultChecked={defaultChecked} />
      <Label htmlFor="auto-refresh">Auto-refresh</Label>
    </div>
  )
}

export default AutoRefreshSwitch;
