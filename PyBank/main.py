import os
import csv

budget_data_csv = os.path.join("Resources","budget_data.csv")
print(budget_data_csv)

with open(budget_data_csv, 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    header = next(csvreader)

    pnl_start = 0.00
    pnl_final = 0.00
    pnl_total = 0.00
    month_count = 0
    pnl_change = 0.00

    greatest_change = {
        "increase": {
            "Date": '01/01/1999',
            "Amt_changed": 0.00
        },
        "decrease": {
            "Date": '01/01/1999',
            "Amt_changed": 0.00           
        }
    }
   
    for record in csvreader:
        if pnl_start == 0:
            pnl_start = float(record[1])
        else:
            pnl_change = float(record[1])-float(pnl_prev)

            if pnl_change > greatest_change["increase"]["Amt_changed"]:
                greatest_change["increase"]["Amt_changed"] = float(pnl_change)
                greatest_change["increase"]["Date"] = record[0]
            elif pnl_change < greatest_change["decrease"]["Amt_changed"]:
                greatest_change["decrease"]["Amt_changed"] = float(pnl_change)
                greatest_change["decrease"]["Date"] = record[0]

        pnl_total += float(record[1])
        month_count += 1        

        pnl_prev = float(record[1])

pnl_final = float(record[1])
avg_pnl_change = (pnl_final - pnl_start) /month_count

print("Total Months: " + str(month_count))
print("Total: " + '{:,.2f}'.format(pnl_total))
print("Average Change: " + '{:,.2f}'.format(avg_pnl_change))
print("Greatest Increase in Profits: " + greatest_change["increase"]["Date"] + " " + '{:,.2f}'.format(greatest_change["increase"]["Amt_changed"]))
print("Greatest Decrease in Profits: " + greatest_change["decrease"]["Date"] + " " + '{:,.2f}'.format(greatest_change["decrease"]["Amt_changed"]))

output_path = os.path.join("FinancialAnalysis.txt")

with open(output_path, 'w') as csvfile:

    csvwriter = csv.writer(csvfile, skipinitialspace=True, escapechar=' ', quoting=csv.QUOTE_NONE)
    csvwriter.writerow(["Total Months: " + str(month_count)])
    csvwriter.writerow(["Total: $" + '{:,.2f}'.format(pnl_total).strip('"')])
    #csvwriter.writerow([f"Total: ${pnl_total:,.2f}"]) 
    csvwriter.writerow(["Average Change: $" + '{:,.2f}'.format(avg_pnl_change)])
    csvwriter.writerow(["Greatest Increase in Profits: " + greatest_change["increase"]["Date"] + " $" + '{:,.2f}'.format(greatest_change["increase"]["Amt_changed"])])
    csvwriter.writerow(["Greatest Decrease in Profits: " + greatest_change["decrease"]["Date"] + " $" + '{:,.2f}'.format(greatest_change["decrease"]["Amt_changed"])])