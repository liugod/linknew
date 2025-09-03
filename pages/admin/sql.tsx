import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Code,
  Container,
  Heading,
  HStack,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

type SqlResult = {
  success: boolean
  data?: any[]
  rowsAffected?: number
  error?: string
  query?: string
}

const SqlAdminPage = () => {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SqlResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a SQL query',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data: SqlResult = await response.json()
      setResult(data)

      if (data.success) {
        toast({
          title: 'Query executed successfully',
          description: `${data.rowsAffected} rows returned`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Query failed',
          description: data.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Network error occurred',
      })
      toast({
        title: 'Network Error',
        description: 'Failed to execute query',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearQuery = () => {
    setQuery('')
    setResult(null)
  }

  if (status === 'loading') {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading...</Text>
        </VStack>
      </Container>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <NextSeo title="SQL Admin - TradLink" />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>
              SQL Admin Panel
            </Heading>
            <Text color="gray.600">
              Execute SQL queries directly against the database. Only SELECT queries are allowed for
              security.
            </Text>
          </Box>

          <Alert status="warning">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Security Notice</Text>
              <Text fontSize="sm">
                This is a powerful admin tool. Only SELECT queries are permitted. Be careful when
                querying large datasets as it may impact performance.
              </Text>
            </Box>
          </Alert>

          <Box>
            <Text fontWeight="semibold" mb={2}>
              SQL Query:
            </Text>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Enter your SQL query here... (e.g., SELECT * FROM "User" LIMIT 10)'
              minHeight="150px"
              fontFamily="monospace"
              fontSize="sm"
            />
          </Box>

          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              onClick={executeQuery}
              isLoading={isLoading}
              loadingText="Executing..."
              isDisabled={!query.trim()}
            >
              Execute Query
            </Button>
            <Button variant="outline" onClick={clearQuery}>
              Clear
            </Button>
          </HStack>

          {result && (
            <Box>
              <HStack justify="space-between" align="center" mb={4}>
                <Heading size="md">Query Result</Heading>
                <HStack spacing={2}>
                  <Badge colorScheme={result.success ? 'green' : 'red'}>
                    {result.success ? 'Success' : 'Error'}
                  </Badge>
                  {result.success && <Badge colorScheme="blue">{result.rowsAffected} rows</Badge>}
                </HStack>
              </HStack>

              {result.query && (
                <Box mb={4}>
                  <Text fontWeight="semibold" mb={2}>
                    Executed Query:
                  </Text>
                  <Code p={3} display="block" whiteSpace="pre-wrap" fontSize="sm">
                    {result.query}
                  </Code>
                </Box>
              )}

              {!result.success ? (
                <Alert status="error">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">Error</Text>
                    <Text fontSize="sm">{result.error}</Text>
                  </Box>
                </Alert>
              ) : result.data && result.data.length > 0 ? (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        {Object.keys(result.data[0]).map((key) => (
                          <Th key={key}>{key}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {result.data.map((row, index) => (
                        <Tr key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <Td key={cellIndex} maxWidth="200px">
                              <Text isTruncated>
                                {value === null
                                  ? 'NULL'
                                  : typeof value === 'object'
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </Text>
                            </Td>
                          ))}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  <Text>Query executed successfully but returned no results.</Text>
                </Alert>
              )}
            </Box>
          )}
        </VStack>
      </Container>
    </>
  )
}

export default SqlAdminPage
