import DynamicIcon from 'components/DynamicIcon'
import ICON_OPTIONS from 'consts/icons'
import { FaIconKey, TIcon } from 'types/user'

const Icon = ({ icon: iconProp }: { icon: TIcon }) => {
  const icon = ICON_OPTIONS.find((option) => option.name === iconProp.name)?.icon as FaIconKey

  return <DynamicIcon size="40" icon={icon || 'FaGithub'} />
}

export default Icon
