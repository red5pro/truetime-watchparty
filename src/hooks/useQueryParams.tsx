import { useLocation } from 'react-router-dom'

const useQueryParams = () => new URLSearchParams(useLocation().search)

export default useQueryParams
