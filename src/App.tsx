import { useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"
import { CheckboxProvider } from "./hooks/checkBoxContext"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(EMPTY_EMPLOYEE)


  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()
    await employeeUtils.fetchAll()
    setIsLoading(false)
    await paginatedTransactionsUtils.fetchAll()
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <>
      <CheckboxProvider>
        <main className="MainContainer">
          <Instructions />

          <hr className="RampBreak--l" />

          <InputSelect<Employee>
            isLoading={isLoading}
            defaultValue={EMPTY_EMPLOYEE}
            items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
            label="Filter by employee"
            loadingLabel="Loading employees"
            parseItem={(item) => ({
              value: item.id,
              label: `${item.firstName} ${item.lastName}`,
            })}
            onChange={async (newValue) => {
              if (!newValue) return

              setSelectedEmployee(newValue)

              if (newValue.id === EMPTY_EMPLOYEE.id) {
                await loadAllTransactions()
              } else {
                await loadTransactionsByEmployee(newValue.id)
              }
            }}

          />

          <div className="RampBreak--l" />

          <div className="RampGrid">
            <Transactions transactions={transactions} />

            {transactions !== null &&
              selectedEmployee.id === EMPTY_EMPLOYEE.id &&
              paginatedTransactions?.nextPage !== null && (
                <button
                  className="RampButton"
                  onClick={async () => {
                    await paginatedTransactionsUtils.fetchAll()
                  }}
                >
                  View More
                </button>
              )}

          </div>

        </main>
      </CheckboxProvider>
    </>
  )
}
