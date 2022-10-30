# ruuvinkanta

### Running without root/sudo (Linux-specific)

Run the following command:

```sh
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

### ruuviTagsToRead.json example

```
{
    "macs": [
        "0123456789abc",
        "9876543210def"
    ]
}
```