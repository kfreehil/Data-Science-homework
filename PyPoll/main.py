import os
import csv

election_data_csv = os.path.join("Resources", "election_data.csv")
print(election_data_csv)

with open(election_data_csv, 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    header = next(csvreader)

    election_results={}

    for record in csvreader:
        if record[2] in election_results:
            election_results[record[2]] += 1
        else:
            election_results[record[2]] = 1
    
print(election_results)
print(sum(election_results.values()))
print(vote_total)

print("Election Results")
print("--------------------------------")
print("Total Votes: " + str(sum(election_results.values())))
print("--------------------------------")
print("Total: " + '{:,.2f}'.format(pnl_total))
print("Average Change: " + '{:,.2f}'.format(avg_pnl_change))
print("Greatest Increase in Profits: " + greatest_change["increase"]["Date"] + " " + '{:,.2f}'.format(greatest_change["increase"]["Amt_changed"]))
print("Greatest Decrease in Profits: " + greatest_change["decrease"]["Date"] + " " + '{:,.2f}'.format(greatest_change["decrease"]["Amt_changed"]))

# output_path = os.path.join("new.csv")

# with open(output_path, 'w', newline='') as csvfile:

#     csvwriter = csv.writer(csvfile)
#     csvwriter.writerow(["Total Months: " + str(month_count)])
#     csvwriter.writerow(["Total: " + '{:,.2f}'.format(pnl_total)])
#     csvwriter.writerow(["Average Change: " + '{:,.2f}'.format(avg_pnl_change)])
#     csvwriter.writerow(["Greatest Increase in Profits: " + greatest_change["increase"]["Date"] + " " + '{:,.2f}'.format(greatest_change["increase"]["Amt_changed"])])
#     csvwriter.writerow(["Greatest Decrease in Profits: " + greatest_change["decrease"]["Date"] + " " + '{:,.2f}'.format(greatest_change["decrease"]["Amt_changed"])])