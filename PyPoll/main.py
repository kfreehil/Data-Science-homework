import os
import csv

def get_result_string(dict_results):
    total_votes = sum(election_results.values())
    winning_votes = max(election_results.values())

    result = ("Election Results\n" +  
            "---------------------------\n" + 
            f"Total Votes: {total_votes}\n" +
            "---------------------------")

    for candidate, vote_tally in election_results.items():
        result = (result + "\n" +
                candidate + ": " + '{:.3f}%'.format((vote_tally/total_votes)*100) + " " + str(vote_tally))
        if vote_tally == winning_votes:
            winner = candidate

    result = (result + "\n" +
            "---------------------------\n" + 
            f"Winner: {winner}\n" +
            "---------------------------")
    return result


election_data_csv = os.path.join("Resources", "election_data.csv")

with open(election_data_csv, 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    header = next(csvreader)

    election_results={}

    for record in csvreader:
        if record[2] in election_results:
            election_results[record[2]] += 1
        else:
            election_results[record[2]] = 1

result = get_result_string(election_results)

print(result)

output_path = os.path.join("output.txt")
with open(output_path, 'w') as csvfile:
     csvfile.write(result)
     csvfile.close()    
