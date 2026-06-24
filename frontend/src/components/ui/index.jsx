import Card, { CardHeader, CardTitle, CardContent } from '../../../@/components/ui/card.jsx'
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '../../../@/components/ui/table.jsx'
import { Button } from '../../../@/components/ui/button.jsx'
import Input from '../../../@/components/ui/input.jsx'
import Textarea from '../../../@/components/ui/textarea.jsx'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../@/components/ui/tabs.jsx'
import { Badge } from '../../../@/components/ui/badge.jsx'

// Simple Select wrapper
export function Select(props) {
  const { className = '', children, ...rest } = props
  return (
    <select className={`p-2 border rounded ${className}`} {...rest}>
      {children}
    </select>
  )
}

// Simple Skeleton component
export function Skeleton({ className = '', ...rest }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} {...rest} />
}

// Re-export commonly used components
export { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, Button, Input, Textarea, Tabs, TabsList, TabsTrigger, TabsContent, Badge }

export default {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Button,
  Input,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Select,
  Skeleton,
}
